import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Wind,
  Heart,
  Globe,
  Key,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { SarvamAvatar } from './SarvamAvatar';
import { soundService } from '../services/soundService';
import { storageService } from '../services/storageService';
import { NamingCompanionModal } from './NamingCompanionModal';

interface SarvamSpeakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMindfulMinutes?: (mins: number) => void;
  companionName?: string;
  onCompanionNameChange?: (name: string) => void;
}

interface DialogueEntry {
  id: string;
  sender: 'sarvam' | 'user';
  text: string;
  time: string;
  action?: 'breathing' | 'affirmation' | 'bodyscan';
  audioError?: string;
}

export const SarvamSpeakingModal: React.FC<SarvamSpeakingModalProps> = ({
  isOpen,
  onClose,
  onAddMindfulMinutes,
  companionName: propCompanionName,
  onCompanionNameChange
}) => {
  const [companionName, setCompanionName] = useState<string>(
    () => propCompanionName || storageService.getCompanionName() || 'Meera'
  );
  const [speakerVoice, setSpeakerVoice] = useState<string>(
    () => storageService.getCompanionVoice() || 'kavya'
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [isGuidingBreath, setIsGuidingBreath] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [isApiConfigured, setIsApiConfigured] = useState<boolean>(false);
  const [showKeyGuide, setShowKeyGuide] = useState<boolean>(false);
  const [isNamingModalOpen, setIsNamingModalOpen] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const [dialogue, setDialogue] = useState<DialogueEntry[]>([]);

  const recognitionRef = useRef<any>(null);
  const dialogueEndRef = useRef<HTMLDivElement>(null);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync companion name if updated externally
  useEffect(() => {
    if (propCompanionName) {
      setCompanionName(propCompanionName);
    }
  }, [propCompanionName]);

  // Check backend Sarvam API status safely
  const checkApiStatus = () => {
    fetch('/api/sarvam/status')
      .then((res) => res.json())
      .then((data) => {
        setIsApiConfigured(Boolean(data.configured));
      })
      .catch(() => {
        setIsApiConfigured(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      checkApiStatus();
      const currentName = storageService.getCompanionName();
      setCompanionName(currentName);
      setSpeakerVoice(storageService.getCompanionVoice());

      // If user has never named their companion, prompt them
      if (!storageService.hasNamedCompanion()) {
        setIsNamingModalOpen(true);
      }
    }
  }, [isOpen]);

  // Initialize dialogue with companion name
  useEffect(() => {
    if (!isOpen) return;

    const greetingText =
      lang === 'hi'
        ? `नमस्ते। मैं ${companionName} हूँ, आपकी व्यक्तिगत ध्यान साथी। एक गहरी और शांत सांस लीजिए। आज आपका मन कैसा महसूस कर रहा है?`
        : `Namaste. I am ${companionName}, your personal sanctuary companion. Take a gentle breath and let your shoulders drop. How is your heart and mind feeling in this moment?`;

    setDialogue([
      {
        id: 's-init-' + Date.now(),
        sender: 'sarvam',
        text: greetingText,
        time: 'Just now'
      }
    ]);

    // Gently play soft ambient sound if none is active
    const activeAmb = soundService.getCurrentAmbient();
    if (!activeAmb) {
      soundService.startAmbient('flute');
    }

    // Only speak using Sarvam API model (never browser computer voice)
    const timer = setTimeout(() => {
      speakMessage(greetingText);
    }, 500);

    return () => {
      clearTimeout(timer);
      soundService.stopSpeaking();
      if (!activeAmb) {
        soundService.stopAmbient();
      }
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    };
  }, [isOpen, companionName, lang, speakerVoice]);

  // Auto-scroll chat transcript
  useEffect(() => {
    dialogueEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogue, isSpeaking]);

  // Speak with Sarvam API Model - Strictly NO generic computer voice
  const speakMessage = async (text: string) => {
    soundService.stopSpeaking();
    setApiErrorMessage(null);

    const result = await soundService.speakSarvam(text, {
      speaker: speakerVoice,
      lang,
      pace: 0.85,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false)
    });

    if (!result.success) {
      setIsSpeaking(false);
      if (result.error) {
        setApiErrorMessage(result.error);
      }
    }
  };

  // Toggle voice recognition for user input
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      handleUserSubmit('I am feeling anxious and need your gentle voice.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        soundService.stopSpeaking();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript) {
          handleUserSubmit(transcript);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Handle user dialogue submission
  const handleUserSubmit = (textToSend = userInput) => {
    if (!textToSend.trim()) return;

    const trimmed = textToSend.trim();
    setUserInput('');

    const userMsg: DialogueEntry = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: trimmed,
      time: 'Now'
    };
    setDialogue((prev) => [...prev, userMsg]);

    if (onAddMindfulMinutes) {
      onAddMindfulMinutes(1);
    }

    const lower = trimmed.toLowerCase();
    let replyText = '';
    let actionType: 'breathing' | 'affirmation' | 'bodyscan' | undefined;

    if (
      lower.includes('breath') ||
      lower.includes('breathe') ||
      lower.includes('saans') ||
      lower.includes('pacer')
    ) {
      replyText =
        lang === 'hi'
          ? 'चलिए मेरे साथ तीन गहरी और आरामदायक सांसें लेते हैं। अपनी आँखों को कोमलता से बंद कीजिए... नाक से धीरे-धीरे सांस अंदर... और मुंह से हल्की आह के साथ बाहर।'
          : 'Let us take three healing, paced breaths together right now. Soften your gaze... Breathe in with me through your nose... and release all heaviness with a soft sigh.';
      actionType = 'breathing';
      startInteractiveBreathCycle();
    } else if (
      lower.includes('anxiety') ||
      lower.includes('panic') ||
      lower.includes('scared') ||
      lower.includes('heart') ||
      lower.includes('nervous') ||
      lower.includes('darr')
    ) {
      replyText =
        lang === 'hi'
          ? 'मैं आपकी बात समझ रही हूँ। घबराहट एक लहर की तरह आती है, लेकिन यह हमेशा शांत हो जाती है। अपने दोनों पैरों को जमीन पर महसूस कीजिए। आप इस समय पूरी तरह सुरक्षित हैं।'
          : 'I hear you, and I am right here holding space with you. Anxiety is just a wave of adrenaline—it peaks and it passes. Notice the solid ground beneath your feet. You are safe in this physical room, and you have time.';
      soundService.playSingingBowl(216, 3);
    } else if (
      lower.includes('sleep') ||
      lower.includes('neend') ||
      lower.includes('tired') ||
      lower.includes('night') ||
      lower.includes('insomnia') ||
      lower.includes('exhausted')
    ) {
      replyText =
        lang === 'hi'
          ? 'रात के समय विचारों का आना स्वाभाविक है। सोने का दबाव खुद पर मत डालिए। सिर्फ अपनी पलकों को भारी होने दीजिए और अपने जबड़े को ढीला छोड़ दीजिए।'
          : 'Nighttime rumination can feel lonely, but your body is resting simply by lying still. Drop your lower jaw slightly away from your teeth. Let your eyelids feel heavy and warm. Tomorrow will take care of itself.';
      soundService.playChime(432, 2.5);
    } else if (
      lower.includes('affirm') ||
      lower.includes('hope') ||
      lower.includes('strength') ||
      lower.includes('quote')
    ) {
      replyText =
        lang === 'hi'
          ? 'आज के लिए आपका शांत संकल्प: "मैं अपनी सीमाओं का सम्मान करता हूँ। मैं हर परिस्थिति में अपने भीतर शांति चुन सकता हूँ।"'
          : 'Here is your grounding anchor for today: "I do not have to carry everything all at once. In this single breath, I am whole, resilient, and enough."';
      actionType = 'affirmation';
      soundService.playSingingBowl(240, 3.5);
    } else if (
      lower.includes('body') ||
      lower.includes('jaw') ||
      lower.includes('tension') ||
      lower.includes('shoulder') ||
      lower.includes('dard')
    ) {
      replyText =
        lang === 'hi'
          ? 'अपनी गर्दन और कंधों को धीरे से घुमाइए। अपने माथे की सिलवटों को सहज कीजिए। शरीर की जकड़न को सांस के साथ विसर्जित होने दीजिए।'
          : 'Let us do a gentle body softening. Notice where your shoulders are—can you lower them two inches right now? Unclench your jaw and let your tongue rest quietly on the floor of your mouth.';
      actionType = 'bodyscan';
    } else {
      replyText =
        lang === 'hi'
          ? `अपनी भावनाएं साझा करने के लिए धन्यवाद। "${trimmed}" महसूस करना बिल्कुल स्वाभाविक है। शांत मन से एक गहरी सांस लीजिए। मैं हमेशा आपके साथ हूँ।`
          : `Thank you for sharing that with me. Acknowledging "${trimmed}" without judgment is the first step toward calm. Take a gentle breath into your lower belly. Would you like to breathe together, or receive a grounding affirmation?`;
      soundService.playChime(528, 1.2);
    }

    setTimeout(() => {
      const sarvamMsg: DialogueEntry = {
        id: 's-' + Date.now(),
        sender: 'sarvam',
        text: replyText,
        time: 'Just now',
        action: actionType
      };
      setDialogue((prev) => [...prev, sarvamMsg]);
      speakMessage(replyText);
    }, 600);
  };

  const startInteractiveBreathCycle = () => {
    setIsGuidingBreath(true);
    let count = 0;
    setBreathPhase('Inhale');

    breathTimerRef.current = setInterval(() => {
      count++;
      if (count === 4) {
        setBreathPhase('Hold');
      } else if (count === 6) {
        setBreathPhase('Exhale');
      } else if (count >= 12) {
        count = 0;
        setBreathPhase('Inhale');
      }
    }, 1000);

    setTimeout(() => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      setIsGuidingBreath(false);
    }, 24000);
  };

  const stopSpeaking = () => {
    soundService.stopSpeaking();
    setIsSpeaking(false);
  };

  const handleNameSaved = (newName: string, newVoice: string) => {
    setCompanionName(newName);
    setSpeakerVoice(newVoice);
    if (onCompanionNameChange) {
      onCompanionNameChange(newName);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0f1715]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#1b2b25] to-[#121c18] border border-[#3b554b] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-[#e4eae6] max-h-[94vh]">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-[#2d4239] bg-[#16241f]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#263e34] border border-[#3c594c] flex items-center justify-center text-sm shadow-xs">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#f0f4f1] tracking-tight flex items-center gap-1.5">
                  <span>{companionName}</span>
                  <button
                    onClick={() => setIsNamingModalOpen(true)}
                    className="p-1 text-[#8ba497] hover:text-[#d3e5dc] rounded-md transition-colors cursor-pointer"
                    title="Name or rename your AI guide"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </h2>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                    isApiConfigured
                      ? 'bg-[#244234] border-[#3e6853] text-[#a4d4bc]'
                      : 'bg-[#3b2e25] border-[#5e4b3c] text-[#d6bda4]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isApiConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span>{isApiConfigured ? 'Sarvam Neural Bulbul Active' : 'API Key Setup Needed'}</span>
                </span>
              </div>
              <p className="text-[11px] text-[#9eb2a8] flex items-center gap-2">
                <span>Sarvam Voice: {speakerVoice.toUpperCase()}</span>
                <span>•</span>
                <button
                  onClick={() => setIsNamingModalOpen(true)}
                  className="text-[#96c4af] hover:underline cursor-pointer"
                >
                  Change Name & Voice
                </button>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Safe API Info Modal Trigger */}
            <button
              onClick={() => setShowKeyGuide(!showKeyGuide)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-[#24352e] hover:bg-[#2e423a] border border-[#3c5046] text-[#b5c7be] transition-colors cursor-pointer"
              title="How to provide Sarvam API key safely without exposing it"
            >
              <Key className="w-3 h-3 text-[#d2be99]" />
              <span className="hidden sm:inline">API Setup</span>
            </button>

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-[#24352e] hover:bg-[#2e423a] border border-[#3c5046] text-[#b5c7be] transition-colors cursor-pointer"
              title="Switch language"
            >
              <Globe className="w-3 h-3 text-[#8ca89d]" />
              <span>{lang === 'en' ? 'English' : 'हिन्दी'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-[#889d93] hover:text-white hover:bg-[#263a31] rounded-full transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Error Banner if synthesis failed */}
        {apiErrorMessage && (
          <div className="bg-[#35201f] border-b border-[#542d2a] px-4 py-2.5 text-xs text-[#eed2d2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#e08989] shrink-0" />
              <span>
                <strong>Sarvam Voice Note:</strong> {apiErrorMessage}. (Generic browser voice is disabled to respect API models).
              </span>
            </div>
            <button
              onClick={() => setShowKeyGuide(true)}
              className="text-xs text-[#f5c6c6] underline font-semibold shrink-0 ml-2"
            >
              Check Setup
            </button>
          </div>
        )}

        {/* Informative API Key Security Drawer / Banner */}
        {showKeyGuide && (
          <div className="bg-[#172620] border-b border-[#2d4239] p-4 text-xs text-[#cad5cf] space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[#e1ece6]">
                <ShieldCheck className="w-4 h-4 text-[#8ec5a9]" />
                <span>How to provide your Sarvam API Key safely (No Exposing)</span>
              </div>
              <button
                onClick={() => setShowKeyGuide(false)}
                className="text-[#889d93] hover:text-white text-xs font-semibold cursor-pointer"
              >
                Close ✕
              </button>
            </div>
            <p className="leading-relaxed text-[#a8b8b0]">
              To protect your credentials, <strong>NEVER paste API keys into chat messages or code files</strong>.
              AuraCalm has a secure server-side proxy route (<code className="bg-[#0f1915] px-1.5 py-0.5 rounded text-[#cbdad2]">/api/sarvam/tts</code>) that only reads the secret from backend environment variables.
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[#b3c4bb] bg-[#121f19] p-3 rounded-xl border border-[#263830]">
              <li>Open the <strong>Secrets panel</strong> (Key icon 🔑) in Google AI Studio on the top-right toolbar.</li>
              <li>Add a new secret name: <code className="font-mono text-[#d8c39e] font-bold">SARVAM_API_KEY</code></li>
              <li>Paste your subscription key value from your Sarvam AI dashboard (<code className="font-mono text-[#cbdad2]">api.sarvam.ai</code>).</li>
              <li>Save it! The server automatically loads it into <code className="font-mono text-[#cbdad2]">process.env.SARVAM_API_KEY</code> and synthesizes voice strictly using Bulbul v3 API models.</li>
            </ol>
            <div className="text-[11px] text-[#869b91] flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8ec5a9]" />
                <span>Status: {isApiConfigured ? '✅ Active and verified on server!' : '⚠️ Key not detected in process.env.SARVAM_API_KEY'}</span>
              </span>
              <button
                onClick={checkApiStatus}
                className="text-[#8ec5a9] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-check Status</span>
              </button>
            </div>
          </div>
        )}

        {/* Central Avatar Visual Stage */}
        <div className="py-4 px-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#182a23]/60 via-transparent to-transparent relative shrink-0">
          <SarvamAvatar
            isSpeaking={isSpeaking}
            isListening={isListening}
            mood={isGuidingBreath ? 'breathing' : isSpeaking ? 'compassionate' : 'calm'}
            size="md"
          />

          <div className="mt-2 text-center">
            <span className="text-xs font-semibold text-[#8dc0a8] flex items-center justify-center gap-1.5">
              <span>{companionName}</span>
              <span className="text-[10px] text-[#718a7e] font-normal">• Sarvam Voice Guide</span>
            </span>
          </div>

          {isGuidingBreath && (
            <div className="mt-3 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b362c] border border-[#3e6654] text-xs font-bold text-[#b5deca] animate-pulse">
              <Wind className="w-3.5 h-3.5 text-[#8dc0a8]" />
              <span>{companionName}'s Breathing Rhythm: {breathPhase}</span>
            </div>
          )}

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="mt-2.5 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-[#a8d1be] bg-[#192b23] border border-[#334e40] hover:bg-[#22392e] transition-colors cursor-pointer"
            >
              <VolumeX className="w-3 h-3 text-[#8ebfa8]" />
              <span>Tap to pause voice</span>
            </button>
          )}
        </div>

        {/* Dialogue Transcript Scroll Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 bg-[#101916]/70 border-y border-[#23352d]">
          {dialogue.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  item.sender === 'user'
                    ? 'bg-[#2d4d41] text-[#f2f7f4] rounded-br-xs shadow-md border border-[#3d6354]'
                    : 'bg-[#182620] border border-[#2b3e34] text-[#d6dfda] rounded-bl-xs shadow-md'
                }`}
              >
                {item.sender === 'sarvam' && (
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#8ebca6] mb-1">
                    <span className="flex items-center gap-1">
                      🌸 <span>{companionName} (Sarvam AI)</span>
                    </span>
                    <button
                      onClick={() => speakMessage(item.text)}
                      title="Replay Sarvam voice audio"
                      className="p-1 hover:text-white cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <p>{item.text}</p>

                {item.action === 'breathing' && (
                  <div className="mt-2.5 pt-2 border-t border-[#293c33] flex items-center gap-2">
                    <button
                      onClick={startInteractiveBreathCycle}
                      className="px-3 py-1 bg-[#264236] hover:bg-[#315243] text-[#cae2d6] rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs border border-[#3c5f4f]"
                    >
                      <Wind className="w-3.5 h-3.5" />
                      <span>Follow {companionName}'s Breath</span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#697c72] px-1 mt-1 font-mono">{item.time}</span>
            </div>
          ))}

          <div ref={dialogueEndRef} />
        </div>

        {/* Quick Conversation Prompts */}
        <div className="px-4 py-2.5 bg-[#121c18] border-b border-[#23352d] overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-[#869b91] shrink-0">
            Ask {companionName}:
          </span>
          {[
            { label: '🌿 Calm acute anxiety', prompt: 'I feel anxious right now, can you ground me?', color: 'bg-[#1b2b24] hover:bg-[#253930] text-[#aed3c2] border-[#314a3e]' },
            { label: '🫁 Breathe with me', prompt: 'Please guide me through a calming breathwork.', color: 'bg-[#18282e] hover:bg-[#21353d] text-[#a9cada] border-[#2e4752]' },
            { label: '🌙 Can\'t fall asleep', prompt: 'I cannot sleep tonight, talk me down peacefully.', color: 'bg-[#23202e] hover:bg-[#2d293b] text-[#c6bedb] border-[#3c374e]' },
            { label: '✨ Daily affirmation', prompt: 'Give me a reassuring affirmation for today.', color: 'bg-[#2a261c] hover:bg-[#383325] text-[#dbccae] border-[#4c4432]' },
            { label: '💆‍♀️ Relax body & jaw', prompt: 'Help me release the physical tension in my body.', color: 'bg-[#2a1e1f] hover:bg-[#38282a] text-[#dbb6b6] border-[#4b3537]' }
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleUserSubmit(chip.prompt)}
              className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-colors cursor-pointer shrink-0 ${chip.color}`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Bottom Input & Voice Interaction Controls */}
        <div className="p-3.5 bg-[#121c18] flex items-center gap-2.5">
          <button
            onClick={toggleSpeechRecognition}
            className={`p-3 rounded-2xl transition-all duration-300 shadow-md flex items-center justify-center shrink-0 cursor-pointer ${
              isListening
                ? 'bg-[#8c4642] hover:bg-[#9d4f4a] text-white scale-105 shadow-rose-950/40 animate-pulse'
                : 'bg-[#28483b] hover:bg-[#33594a] text-[#d6ebe0] border border-[#3e6754]'
            }`}
            title={isListening ? 'Listening... tap to stop' : `Tap to speak to ${companionName}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUserSubmit()}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : lang === 'hi'
                ? `${companionName} से कुछ भी पूछें या बात करें...`
                : `Speak or type to ${companionName}... take your time.`
            }
            className="flex-1 bg-[#18241f] border border-[#2e4338] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#e4eae6] placeholder:text-[#6e8278] focus:outline-none focus:ring-2 focus:ring-[#446d5a]/60"
          />

          <button
            onClick={() => handleUserSubmit()}
            disabled={!userInput.trim()}
            className="p-3 bg-[#264437] hover:bg-[#315646] disabled:opacity-30 disabled:pointer-events-none text-white rounded-2xl transition-colors cursor-pointer shrink-0 border border-[#3a614e]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Companion Naming & Voice Customization Modal */}
      <NamingCompanionModal
        isOpen={isNamingModalOpen}
        onClose={() => setIsNamingModalOpen(false)}
        initialName={companionName}
        initialVoice={speakerVoice}
        onNameSaved={handleNameSaved}
      />
    </div>
  );
};
