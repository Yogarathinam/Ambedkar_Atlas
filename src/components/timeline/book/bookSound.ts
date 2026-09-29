// Synthesized subtle paper-turn sound effect using browser Web Audio API
// Completely zero-network, ultra lightweight, and respecting user sound preferences.

class BookAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // default muted to respect accessibility & user comfort

  constructor() {
    try {
      const saved = localStorage.getItem('ambedkar_atlas_book_sound');
      if (saved === 'true') {
        this.isMuted = false;
      }
    } catch {
      // ignore
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('ambedkar_atlas_book_sound', this.isMuted ? 'false' : 'true');
    } catch {
      // ignore
    }
    if (!this.isMuted) {
      this.playPageTurn();
    }
    return this.isMuted;
  }

  public playPageTurn() {
    if (this.isMuted) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const duration = 0.18;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate soft pink/brown textured noise for paper friction
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink filter
        lastOut = (lastOut * 0.95) + (white * 0.05);
        data[i] = lastOut;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to sculpt parchment whisper
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + duration);
      filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

      // Smooth amplitude envelope (decay)
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // Audio autoplay or permissions policy may restrict
    }
  }
}

export const bookAudio = new BookAudioEngine();
