import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Check if Sarvam API key is configured safely in environment
  app.get('/api/sarvam/status', (req, res) => {
    const rawKey = process.env.SARVAM_API_KEY;
    const hasKey = Boolean(rawKey && rawKey.trim() !== '' && rawKey !== 'MY_SARVAM_API_KEY');
    res.json({
      configured: hasKey,
      speakers: ['kavya', 'simran', 'pooja', 'ritu', 'priya', 'shreya', 'ishita', 'neha'],
      model: 'bulbul:v3'
    });
  });

  // Secure Server-Side Proxy for Sarvam AI TTS (Protects API Key)
  app.post('/api/sarvam/tts', async (req, res) => {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_SARVAM_API_KEY') {
      return res.status(400).json({
        error: 'SARVAM_API_KEY is not configured in the AI Studio environment variables/secrets.',
        code: 'MISSING_API_KEY'
      });
    }

    const {
      text,
      target_language_code = 'en-IN',
      speaker = 'kavya',
      pace = 0.85
    } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Text prompt is required.' });
    }

    // Clean text: strip excessive whitespace and limit to 2500 chars (Sarvam limit)
    const cleanText = text.trim().slice(0, 2500);

    // Map speaker to valid bulbul:v3 female voices
    const validSpeakers = ['kavya', 'simran', 'pooja', 'ritu', 'priya', 'shreya', 'ishita', 'neha'];
    let chosenSpeaker = speaker.toLowerCase();
    if (!validSpeakers.includes(chosenSpeaker)) {
      if (chosenSpeaker === 'meera') chosenSpeaker = 'kavya';
      else if (chosenSpeaker === 'aarohi') chosenSpeaker = 'simran';
      else chosenSpeaker = 'kavya';
    }

    const langCode = target_language_code === 'hi' || target_language_code === 'hi-IN' ? 'hi-IN' : 'en-IN';
    const numericPace = typeof pace === 'number' && pace >= 0.5 && pace <= 2.0 ? pace : 0.85;

    // Bulbul:v3 specification: inputs, target_language_code, speaker, pace, model
    // Note: Do NOT include pitch, loudness, speech_sample_rate, or enable_preprocessing as they cause 422 schema validation errors on bulbul:v3!
    const primaryPayload = {
      inputs: [cleanText],
      target_language_code: langCode,
      speaker: chosenSpeaker,
      pace: numericPace,
      model: 'bulbul:v3'
    };

    try {
      let response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': apiKey.trim()
        },
        body: JSON.stringify(primaryPayload)
      });

      // If bulbul:v3 is rejected (e.g. older key or model parameter not supported), try fallback payload without explicit model
      if (!response.ok && response.status === 422) {
        console.warn('Sarvam v3 returned 422, retrying without explicit model parameter...');
        const fallbackPayload = {
          inputs: [cleanText],
          target_language_code: langCode,
          speaker: chosenSpeaker,
          pace: numericPace
        };
        response = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': apiKey.trim()
          },
          body: JSON.stringify(fallbackPayload)
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Sarvam API error:', response.status, errorText);
        return res.status(response.status).json({
          error: `Sarvam API error (${response.status}): ${errorText}`,
          statusCode: response.status
        });
      }

      const data = await response.json();
      if (!data.audios || !Array.isArray(data.audios) || data.audios.length === 0) {
        return res.status(500).json({ error: 'Sarvam API returned an empty audio list.' });
      }

      res.json(data);
    } catch (err: any) {
      console.error('Sarvam TTS proxy error:', err);
      res.status(500).json({ error: err.message || 'Internal error calling Sarvam TTS API' });
    }
  });

  // Attach Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuraCalm server running on http://0.0.0.0:${PORT}`);
  });
}

createServer();
