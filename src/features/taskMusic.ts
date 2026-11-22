const tracks = [
  { bpm: 144, wave: 'triangle', notes: [60, 64, 67, 72, 67, 64, 65, 69, 72, 76, 72, 69, 67, 71, 74, 79] },
  { bpm: 158, wave: 'sine', notes: [69, 69, 72, 76, 74, 72, 69, 67, 65, 69, 72, 77, 76, 72, 69, 67] },
  { bpm: 132, wave: 'triangle', notes: [62, 66, 69, 66, 64, 67, 71, 67, 66, 69, 74, 69, 71, 69, 66, 62] },
  { bpm: 168, wave: 'sine', notes: [72, 67, 69, 72, 74, 69, 71, 74, 76, 72, 74, 76, 79, 76, 74, 72] },
  { bpm: 150, wave: 'triangle', notes: [65, 69, 72, 69, 70, 74, 77, 74, 72, 76, 79, 76, 77, 72, 69, 65] },
] as const;

export function playTaskMusic(): () => void {
  if (typeof AudioContext === 'undefined') return () => {};

  const track = tracks[Math.floor(Math.random() * tracks.length)];
  const context = new AudioContext();
  const step = 30 / track.bpm;
  const start = context.currentTime + 0.03;

  function playNote(note: number, time: number, length: number, volume: number, wave: OscillatorType) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.value = 440 * 2 ** ((note - 69) / 12);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, time + length);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(time);
    oscillator.stop(time + length);
  }

  function stop() {
    window.clearTimeout(timeout);
    if (context.state !== 'closed') void context.close().catch(() => {});
  }

  for (let i = 0; i < track.notes.length * 2; i++) {
    const note = track.notes[i % track.notes.length];
    const time = start + i * step;
    playNote(note, time, step * 0.86, 0.09, track.wave);
    if (i % 2 === 0) playNote(note - 24, time, step, 0.13, 'sine');
  }

  const timeout = window.setTimeout(stop, 100 + track.notes.length * 2 * step * 1000);
  void context.resume().catch(stop);
  return stop;
}
