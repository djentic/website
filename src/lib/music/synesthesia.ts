import type { PitchClass } from '../../types';

// 12 pitch-class colors arranged around the color wheel.
// Uses all 8 solarized accent colors plus 4 blended steps.
export const SYNESTHESIA_COLORS: Record<PitchClass, string> = {
  0:  '#268bd2', // C  — solarized blue
  1:  '#3c9fc4', // C# — blue→cyan blend
  2:  '#2aa198', // D  — solarized cyan
  3:  '#4aaa70', // Eb — cyan→green blend
  4:  '#859900', // E  — solarized green
  5:  '#b58900', // F  — solarized yellow
  6:  '#cb4b16', // F# — solarized orange
  7:  '#dc322f', // G  — solarized red
  8:  '#d33682', // Ab — solarized magenta
  9:  '#a350a0', // A  — magenta→violet blend
  10: '#6c71c4', // Bb — solarized violet
  11: '#93a1a1', // B  — solarized base1 (silver)
};

export const NOTE_NAMES: Record<PitchClass, string> = {
  0: 'C', 1: 'C#', 2: 'D', 3: 'Eb', 4: 'E',
  5: 'F', 6: 'F#', 7: 'G', 8: 'Ab', 9: 'A',
  10: 'Bb', 11: 'B',
};
