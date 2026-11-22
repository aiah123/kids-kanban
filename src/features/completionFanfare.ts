import fanfareAudio from '../assets/completion.mp3?inline';

export function playCompletionFanfare(): () => void {
  const audio = new Audio(fanfareAudio);
  void audio.play().catch(() => {});
  return () => audio.pause();
}
