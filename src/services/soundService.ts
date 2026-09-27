/**
 * Web Audio API ambient soundscape generator and clinical audio cues.
 * Completely client-side, zero latency, no external assets needed.
 */

export type AmbientSoundType = 'ocean' | 'rain' | 'theta' | 'bowl_drone' | 'forest' | 'insects' | 'birds' | 'flute';

class SoundService {
  private ctx: AudioContext | null = null;
  private currentAmbientNode: { stop: () => void } | null = null;
  private currentAmbientType: AmbientSoundType | null = null;
  private masterGain: GainNode | null = null;
  private ambientMasterGain: GainNode | null = null;
  private ambientVolume: number = 0.35; // Default lowered soft background level
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Dedicated ambient gain bus for background soundscapes
      this.ambientMasterGain = this.ctx.createGain();
      this.ambientMasterGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
      this.ambientMasterGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(val: number) {
    this.initContext();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.05);
    }
  }

  public setAmbientVolume(val: number) {
    this.initContext();
    this.ambientVolume = Math.max(0, Math.min(1, val));
    if (this.ambientMasterGain && this.ctx) {
      this.ambientMasterGain.gain.setTargetAtTime(this.ambientVolume, this.ctx.currentTime, 0.05);
    }
  }

  public getAmbientVolume(): number {
    return this.ambientVolume;
  }

  // Play Tibetan Singing Bowl chime
  public playSingingBowl(freq = 216, duration = 4.5) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(0.35, t + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    // Fundamental + overtones
    const harmonics = [1, 2.76, 4.8, 6.2];
    const amplitudes = [0.4, 0.25, 0.15, 0.08];

    harmonics.forEach((h, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const hGain = this.ctx.createGain();
      hGain.gain.value = amplitudes[i];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * h, t);
      osc.connect(hGain);
      hGain.connect(gainNode);
      osc.start(t);
      osc.stop(t + duration);
    });

    gainNode.connect(this.masterGain);
  }

  // Play a soft high-frequency meditation chime
  public playChime(freq = 528, duration = 3) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  // Inhale chime (rising pitch)
  public playInhaleChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.6);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 1.2);
  }

  // Exhale chime (descending gentle pitch)
  public playExhaleChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.8);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 1.5);
  }

  // Continuous Vagus Nerve Hum (130Hz deep resonance)
  public startVagalHum(freq = 130): () => void {
    this.initContext();
    if (!this.ctx || !this.masterGain) return () => {};

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const oscSub = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(freq / 2, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.8);

    osc.connect(gain);
    oscSub.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    oscSub.start();

    return () => {
      if (!this.ctx) return;
      const stopTime = this.ctx.currentTime;
      gain.gain.linearRampToValueAtTime(0.0001, stopTime + 0.5);
      setTimeout(() => {
        try {
          osc.stop();
          oscSub.stop();
          osc.disconnect();
          oscSub.disconnect();
          gain.disconnect();
        } catch {
          // ignore
        }
      }, 500);
    };
  }

  // Bilateral stereo tap for EMDR Butterfly Taps
  public playBilateralTap(panSide: 'left' | 'right') {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(panSide === 'left' ? 220 : 260, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

    if (panner) {
      panner.pan.setValueAtTime(panSide === 'left' ? -0.85 : 0.85, t);
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);
    } else {
      osc.connect(gain);
      gain.connect(this.masterGain);
    }

    osc.start(t);
    osc.stop(t + 0.25);
  }

  // Start continuous ambient soundscape
  public startAmbient(type: AmbientSoundType): void {
    if (this.currentAmbientType === type && this.currentAmbientNode) {
      return; // Already playing
    }
    this.stopAmbient();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentAmbientType = type;

    if (type === 'ocean') {
      this.currentAmbientNode = this.createOceanWaves();
    } else if (type === 'rain') {
      this.currentAmbientNode = this.createGentleRain();
    } else if (type === 'theta') {
      this.currentAmbientNode = this.createThetaDrone();
    } else if (type === 'bowl_drone') {
      this.currentAmbientNode = this.createBowlDrone();
    } else if (type === 'forest') {
      this.currentAmbientNode = this.createForestSound();
    } else if (type === 'insects') {
      this.currentAmbientNode = this.createInsectsChirp();
    } else if (type === 'birds') {
      this.currentAmbientNode = this.createBirdsChirp();
    } else if (type === 'flute') {
      this.currentAmbientNode = this.createBambooFlute();
    }
  }

  public stopAmbient(): void {
    if (this.currentAmbientNode) {
      try {
        this.currentAmbientNode.stop();
      } catch {
        // ignore
      }
      this.currentAmbientNode = null;
      this.currentAmbientType = null;
    }
  }

  public getCurrentAmbient(): AmbientSoundType | null {
    return this.currentAmbientType;
  }

  // Synthesize gentle ocean wave surge using modulated pink/brown noise
  private createOceanWaves(): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const targetGain = this.ambientMasterGain || this.masterGain;
    if (!targetGain) return { stop: () => {} };

    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.98 * b1 + white * 0.08;
      b2 = 0.96 * b2 + white * 0.12;
      output[i] = (b0 + b1 + b2) * 0.4;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter for wave swell
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    // LFO to modulate filter cutoff mimicking ocean swell (8.5s cycle)
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.11;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 500;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.5);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(targetGain);

    whiteNoise.start();
    lfo.start();

    return {
      stop: () => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        gain.gain.linearRampToValueAtTime(0.0001, now + 1.0);
        setTimeout(() => {
          try {
            whiteNoise.stop();
            lfo.stop();
            whiteNoise.disconnect();
            filter.disconnect();
            gain.disconnect();
          } catch {
            // ignore
          }
        }, 1000);
      }
    };
  }

  // Synthesize gentle warm rain
  private createGentleRain(): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const targetGain = this.ambientMasterGain || this.masterGain;
    if (!targetGain) return { stop: () => {} };

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.18;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.10, this.ctx.currentTime + 1.2);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(targetGain);

    whiteNoise.start();

    return {
      stop: () => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        gain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
        setTimeout(() => {
          try {
            whiteNoise.stop();
            whiteNoise.disconnect();
            gain.disconnect();
          } catch {
            // ignore
          }
        }, 800);
      }
    };
  }

  // 432 Hz Theta Binaural calm drone (432Hz & 436Hz -> 4Hz Theta wave)
  private createThetaDrone(): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const targetGain = this.ambientMasterGain || this.masterGain;
    if (!targetGain) return { stop: () => {} };

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.value = 432;

    osc2.type = 'sine';
    osc2.frequency.value = 436; // 4 Hz beat

    subOsc.type = 'sine';
    subOsc.frequency.value = 216; // Harmonic octave below

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 2.0);

    osc1.connect(gain);
    osc2.connect(gain);
    subOsc.connect(gain);
    gain.connect(targetGain);

    osc1.start();
    osc2.start();
    subOsc.start();

    return {
      stop: () => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        gain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
            subOsc.stop();
            gain.disconnect();
          } catch {
            // ignore
          }
        }, 1200);
      }
    };
  }

  // Continuous singing bowl drone
  private createBowlDrone(): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const targetGain = this.ambientMasterGain || this.masterGain;
    if (!targetGain) return { stop: () => {} };

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.value = 288;

    osc2.type = 'sine';
    osc2.frequency.value = 576.4;

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 1.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(targetGain);

    osc1.start();
    osc2.start();

    return {
      stop: () => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        gain.gain.linearRampToValueAtTime(0.0001, now + 1.0);
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
            gain.disconnect();
          } catch {
            // ignore
          }
        }, 1000);
      }
    };
  }

  // Forest breeze with soft rustling
  private createForestSound(): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const targetGain = this.ambientMasterGain || this.masterGain;
    if (!targetGain) return { stop: () => {} };

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;

    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.18;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.09, this.ctx.currentTime + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(targetGain);

    noise.start();
    lfo.start();

    return {
      stop: () => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        gain.gain.linearRampToValueAtTime(0.0001, now + 1.0);
        setTimeout(() => {
          try {
            noise.stop();
            lfo.stop();
            noise.disconnect();
            gain.disconnect();
          } catch {
            // ignore
          }
        }, 1000);
      }
    };
  }

  // Night crickets & twilight forest insects chirp
  private createInsectsChirp(): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const targetGain = this.ambientMasterGain || this.masterGain;
    if (!targetGain) return { stop: () => {} };

    // Soft nocturnal air noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.06;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 450;
    noiseFilter.Q.value = 0.8;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.04;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(targetGain);
    noise.start();

    let isRunning = true;
    const scheduledTimeouts: any[] = [];

    // Dual cricket oscillators with sweet bandpass filtering
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 4550;

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 4820;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 4650;
    filter.Q.value = 3.5;

    const cricketGain = this.ctx.createGain();
    cricketGain.gain.setValueAtTime(0, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(cricketGain);
    cricketGain.connect(targetGain);

    osc1.start();
    osc2.start();

    // Rhythmic chirp burst: 3 gentle pulses
    const triggerChirpGroup = () => {
      if (!isRunning || !this.ctx) return;
      const t = this.ctx.currentTime;
      const pulses = 3;
      for (let p = 0; p < pulses; p++) {
        const start = t + p * 0.065;
        cricketGain.gain.setValueAtTime(0.0001, start);
        cricketGain.gain.linearRampToValueAtTime(0.055, start + 0.02);
        cricketGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.055);
      }
      const nextDelay = 1400 + Math.random() * 1200;
      const tid = setTimeout(triggerChirpGroup, nextDelay);
      scheduledTimeouts.push(tid);
    };

    triggerChirpGroup();

    return {
      stop: () => {
        isRunning = false;
        scheduledTimeouts.forEach(clearTimeout);
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        cricketGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
        noiseGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
            noise.stop();
            osc1.disconnect();
            osc2.disconnect();
            filter.disconnect();
            cricketGain.disconnect();
            noise.disconnect();
            noiseFilter.disconnect();
            noiseGain.disconnect();
          } catch {
            // ignore
          }
        }, 600);
      }
    };
  }

  // Morning dawn birds chorusing with sweet whistles and chirps
  private createBirdsChirp(): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const targetGain = this.ambientMasterGain || this.masterGain;
    if (!targetGain) return { stop: () => {} };

    // Soft morning meadow rustle in background
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.08;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 480;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.035;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(targetGain);
    noise.start();

    let isRunning = true;
    const scheduledTimeouts: any[] = [];

    // Trigger sweet procedural songbird melodies
    const triggerBirdCall = () => {
      if (!isRunning || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      osc.type = 'sine';
      const style = Math.floor(Math.random() * 3);
      const pan = (Math.random() * 1.4) - 0.7;

      if (panner) panner.pan.setValueAtTime(pan, t);

      if (style === 0) {
        // Ascending sweet whistle
        const baseFreq = 2600 + Math.random() * 400;
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, t + 0.12);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, t + 0.22);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.065, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.26);
      } else if (style === 1) {
        // Double sweet chirp
        const f1 = 3000 + Math.random() * 300;
        osc.frequency.setValueAtTime(f1, t);
        osc.frequency.linearRampToValueAtTime(f1 + 550, t + 0.07);
        osc.frequency.setValueAtTime(f1 + 180, t + 0.11);
        osc.frequency.linearRampToValueAtTime(f1 + 750, t + 0.18);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.06, t + 0.03);
        gain.gain.setValueAtTime(0.005, t + 0.09);
        gain.gain.linearRampToValueAtTime(0.06, t + 0.13);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
        osc.start(t);
        osc.stop(t + 0.25);
      } else {
        // Meditative warble trill
        const f0 = 2800 + Math.random() * 350;
        osc.frequency.setValueAtTime(f0, t);
        osc.frequency.linearRampToValueAtTime(f0 + 300, t + 0.08);
        osc.frequency.linearRampToValueAtTime(f0 - 100, t + 0.16);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.055, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.30);
        osc.start(t);
        osc.stop(t + 0.31);
      }

      if (panner) {
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(targetGain);
      } else {
        osc.connect(gain);
        gain.connect(targetGain);
      }

      const nextDelay = 1800 + Math.random() * 1800;
      const tid = setTimeout(triggerBirdCall, nextDelay);
      scheduledTimeouts.push(tid);
    };

    triggerBirdCall();

    return {
      stop: () => {
        isRunning = false;
        scheduledTimeouts.forEach(clearTimeout);
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        noiseGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
        setTimeout(() => {
          try {
            noise.stop();
            noise.disconnect();
            noiseFilter.disconnect();
            noiseGain.disconnect();
          } catch {
            // ignore
          }
        }, 700);
      }
    };
  }

  // Meditative Indian bansuri / bamboo flute with warm harmonic drone
  private createBambooFlute(): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const targetGain = this.ambientMasterGain || this.masterGain;
    if (!targetGain) return { stop: () => {} };

    // Deep tanpura root drone (D3 146.8 Hz + A3 220 Hz)
    const droneOsc1 = this.ctx.createOscillator();
    const droneOsc2 = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    droneOsc1.type = 'sine';
    droneOsc1.frequency.value = 146.83; // D3
    droneOsc2.type = 'sine';
    droneOsc2.frequency.value = 220.0; // A3 fifth
    droneGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.045, this.ctx.currentTime + 2.0);

    droneOsc1.connect(droneGain);
    droneOsc2.connect(droneGain);
    droneGain.connect(targetGain);
    droneOsc1.start();
    droneOsc2.start();

    // Pentatonic meditative notes (D4, F4, G4, A4, C5, D5)
    const ragaNotes = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33];
    let isRunning = true;
    const scheduledTimeouts: any[] = [];
    let noteIndex = 0;

    const playFlutePhrase = () => {
      if (!isRunning || !this.ctx) return;
      const t = this.ctx.currentTime;
      const targetFreq = ragaNotes[noteIndex % ragaNotes.length];
      noteIndex = (noteIndex + 1 + Math.floor(Math.random() * 2)) % ragaNotes.length;

      const duration = 2.8 + Math.random() * 1.2;

      const fluteOsc = this.ctx.createOscillator();
      const fluteHarmonic = this.ctx.createOscillator();
      fluteOsc.type = 'sine';
      fluteHarmonic.type = 'sine';

      // Gentle portamento glide
      fluteOsc.frequency.setValueAtTime(targetFreq * 0.985, t);
      fluteOsc.frequency.exponentialRampToValueAtTime(targetFreq, t + 0.35);
      fluteHarmonic.frequency.setValueAtTime(targetFreq * 1.97, t);
      fluteHarmonic.frequency.exponentialRampToValueAtTime(targetFreq * 2, t + 0.35);

      // Flute vibrato (5 Hz)
      const vibrato = this.ctx.createOscillator();
      vibrato.frequency.value = 5.2;
      const vibratoGain = this.ctx.createGain();
      vibratoGain.gain.setValueAtTime(0, t);
      vibratoGain.gain.linearRampToValueAtTime(3.0, t + 0.8);
      vibrato.connect(vibratoGain);
      vibratoGain.connect(fluteOsc.frequency);
      vibrato.start(t);
      vibrato.stop(t + duration);

      const fluteGain = this.ctx.createGain();
      const harmGain = this.ctx.createGain();
      harmGain.gain.value = 0.2;

      fluteGain.gain.setValueAtTime(0.0001, t);
      fluteGain.gain.linearRampToValueAtTime(0.065, t + 0.7);
      fluteGain.gain.setValueAtTime(0.065, t + duration - 0.9);
      fluteGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      fluteHarmonic.connect(harmGain);
      harmGain.connect(fluteGain);
      fluteOsc.connect(fluteGain);
      fluteGain.connect(targetGain);

      fluteOsc.start(t);
      fluteHarmonic.start(t);
      fluteOsc.stop(t + duration);
      fluteHarmonic.stop(t + duration);

      const nextDelay = (duration + 1.2 + Math.random() * 1.4) * 1000;
      const tid = setTimeout(playFlutePhrase, nextDelay);
      scheduledTimeouts.push(tid);
    };

    playFlutePhrase();

    return {
      stop: () => {
        isRunning = false;
        scheduledTimeouts.forEach(clearTimeout);
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        droneGain.gain.linearRampToValueAtTime(0.0001, now + 1.0);
        setTimeout(() => {
          try {
            droneOsc1.stop();
            droneOsc2.stop();
            droneOsc1.disconnect();
            droneOsc2.disconnect();
            droneGain.disconnect();
          } catch {
            // ignore
          }
        }, 1100);
      }
    };
  }

  // Quick preview of any Sarvam voice model for auditioning
  public async previewSarvamVoice(speaker: string, name?: string): Promise<{ success: boolean; error?: string }> {
    const text = `Namaste! I am ${name || 'your guide'}. Breathe with me, you are safe here.`;
    return this.speakSarvam(text, { speaker, pace: 0.85 });
  }

  // Speak voice instruction with clinical, soothing cadence
  public speakGuidance(text: string, options?: { rate?: number; pitch?: number }): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate ?? 0.85; // Relaxed, slow pace
      utterance.pitch = options?.pitch ?? 0.95; // Gentle, grounding pitch

      const voices = window.speechSynthesis.getVoices();
      // Look for smooth, gentle English or neutral voices
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Google UK English Female') || v.name.includes('Daniel'))
      ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  private currentSarvamAudio: HTMLAudioElement | null = null;

  // Sarvam Interactive Female Voice Speaker - strictly uses Sarvam API models
  public async speakSarvam(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      speaker?: string;
      lang?: 'en' | 'hi';
      pace?: number;
    }
  ): Promise<{ success: boolean; error?: string }> {
    this.stopSpeaking();

    try {
      const resp = await fetch('/api/sarvam/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          target_language_code: options?.lang === 'hi' ? 'hi-IN' : 'en-IN',
          speaker: options?.speaker || 'kavya',
          pace: options?.pace ?? 0.85
        })
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: `Server error ${resp.status}` }));
        console.warn('Sarvam API call returned error:', errData);
        return { success: false, error: errData.error || `HTTP ${resp.status}` };
      }

      const data = await resp.json();
      if (!data.audios || !data.audios[0]) {
        return { success: false, error: 'No audio returned from Sarvam API.' };
      }

      return new Promise((resolve) => {
        const audioUri = `data:audio/wav;base64,${data.audios[0]}`;
        const audio = new Audio(audioUri);
        this.currentSarvamAudio = audio;

        audio.onplay = () => {
          if (options?.onStart) options.onStart();
        };

        audio.onended = () => {
          this.currentSarvamAudio = null;
          if (options?.onEnd) options.onEnd();
          resolve({ success: true });
        };

        audio.onerror = (e) => {
          this.currentSarvamAudio = null;
          if (options?.onEnd) options.onEnd();
          console.error('Audio playback error:', e);
          resolve({ success: false, error: 'Audio playback failed in browser.' });
        };

        audio.play().catch((playErr) => {
          this.currentSarvamAudio = null;
          if (options?.onEnd) options.onEnd();
          console.error('Audio play() rejected:', playErr);
          resolve({ success: false, error: playErr.message || 'Audio play rejected by browser' });
        });
      });
    } catch (err: any) {
      console.error('Sarvam request exception:', err);
      return { success: false, error: err.message || 'Network error reaching Sarvam proxy' };
    }
  }

  private speakBrowserSynthesis(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      persona?: 'meera' | 'aarohi' | 'kavya';
      lang?: 'en' | 'hi';
    }
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        if (options?.onStart) options.onStart();
        setTimeout(() => {
          if (options?.onEnd) options.onEnd();
          resolve();
        }, 1800);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const persona = options?.persona || 'meera';
      if (persona === 'meera') {
        utterance.pitch = 1.06;
        utterance.rate = 0.84;
      } else if (persona === 'aarohi') {
        utterance.pitch = 1.14;
        utterance.rate = 0.78;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 0.88;
      }

      const voices = window.speechSynthesis.getVoices();
      const isHindi = options?.lang === 'hi';

      let preferredVoice: SpeechSynthesisVoice | undefined;

      if (isHindi) {
        preferredVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN'));
      } else {
        preferredVoice =
          voices.find(
            (v) =>
              (v.lang.includes('en-IN') || v.lang.includes('hi-IN')) &&
              (v.name.toLowerCase().includes('female') ||
                v.name.includes('Heera') ||
                v.name.includes('Veena') ||
                v.name.includes('Neerja') ||
                v.name.includes('Lekha'))
          ) ||
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Samantha') ||
                v.name.includes('Victoria') ||
                v.name.includes('Google UK English Female') ||
                v.name.includes('Natural') ||
                v.name.includes('Zira') ||
                v.name.includes('Karen') ||
                v.name.toLowerCase().includes('female'))
          ) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];
      }

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        if (options?.onStart) options.onStart();
      };

      utterance.onend = () => {
        if (options?.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = () => {
        if (options?.onEnd) options.onEnd();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public stopSpeaking() {
    if (this.currentSarvamAudio) {
      try {
        this.currentSarvamAudio.pause();
        this.currentSarvamAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentSarvamAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundService = new SoundService();
