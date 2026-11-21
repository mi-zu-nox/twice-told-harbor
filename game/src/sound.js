/* Tiny synthesized sound effects for Twice-Told Harbor.
   No audio files: every sound is a few oscillator notes shaped in code, so
   the game stays fully offline and self-contained. */

/** Create the sound player. Audio starts lazily on the first user gesture. */
export function createSound() {
  let context = null;
  let enabled = true;

  function ensureContext() {
    if (context === null) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      context = new AudioCtor();
    }
    if (context.state === 'suspended') context.resume();
    return context;
  }

  function tone(freq, start, duration, type = 'sine', volume = 0.16) {
    const ctx = ensureContext();
    if (!ctx || !enabled) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t0 = ctx.currentTime + start;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(volume, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  return {
    get enabled() { return enabled; },
    toggle() {
      enabled = !enabled;
      return enabled;
    },
    /** A bright two-note chime when a difference is found. */
    playFind() {
      tone(880, 0, 0.22, 'sine', 0.18);
      tone(1318, 0.09, 0.3, 'sine', 0.16);
    },
    /** A dull thud for a wrong guess. */
    playMiss() {
      tone(160, 0, 0.2, 'triangle', 0.2);
      tone(110, 0.05, 0.24, 'triangle', 0.16);
    },
    /** A soft tick when a hint is spent. */
    playHint() {
      tone(660, 0, 0.15, 'sine', 0.12);
      tone(660, 0.18, 0.15, 'sine', 0.12);
    },
    /** A little arpeggio when a scene is completed. */
    playSceneWin() {
      [523, 659, 784, 1046].forEach((freq, i) => tone(freq, i * 0.11, 0.3, 'sine', 0.16));
    },
    /** The full fanfare for finishing the third scene. */
    playGameWin() {
      [523, 659, 784, 1046, 784, 1046, 1318].forEach((freq, i) => tone(freq, i * 0.12, 0.34, 'sine', 0.16));
    },
  };
}
