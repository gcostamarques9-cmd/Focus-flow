
class AudioService {
  private ctx: AudioContext | null = null;

  private getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  playStart() {
    this.playTone(880, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(1320, 'sine', 0.1, 0.1), 50);
  }

  playPause() {
    this.playTone(440, 'sine', 0.1, 0.1);
  }

  playComplete() {
    const ctx = this.getContext();
    // A simple chime sequence
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.5, 0.15), i * 150);
    });
  }

  playSuccess() {
    this.playTone(660, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(880, 'sine', 0.2, 0.1), 100);
  }
}

export const audioService = new AudioService();
