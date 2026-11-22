export const celebrations = [
  ['🎉', 'pop'], ['🏆', 'rise'], ['🌟', 'spin'], ['🎈', 'float'],
  ['👏', 'bounce'], ['🦄', 'leap'], ['🌈', 'sweep'], ['🚀', 'launch'],
  ['🥳', 'wiggle'], ['🎊', 'scatter'], ['🦋', 'flutter'], ['🐸', 'hop'],
  ['🍦', 'tumble'], ['💎', 'shine'], ['🌻', 'bloom'], ['⚡', 'zip'],
  ['🪁', 'glide'], ['🍬', 'drop'], ['❤️', 'pulse'], ['🪩', 'disco'],
] as const;

export function randomCelebration() {
  return Math.floor(Math.random() * celebrations.length);
}
