import type { TuningConfig } from '../types';

// Pitch class helpers (inline to avoid circular deps)
// E=4, A=9, D=2, G=7, B=11, e=4

export const STANDARD_6: TuningConfig = {
  name: 'Standard (EADGBe)',
  strings: [
    { stringIndex: 0, pitchClass: 4, octave: 2, displayName: 'E2' },
    { stringIndex: 1, pitchClass: 9, octave: 2, displayName: 'A2' },
    { stringIndex: 2, pitchClass: 2, octave: 3, displayName: 'D3' },
    { stringIndex: 3, pitchClass: 7, octave: 3, displayName: 'G3' },
    { stringIndex: 4, pitchClass: 11, octave: 3, displayName: 'B3' },
    { stringIndex: 5, pitchClass: 4, octave: 4, displayName: 'e4' },
  ],
};

export const DROP_D: TuningConfig = {
  name: 'Drop D (DADGBe)',
  strings: [
    { stringIndex: 0, pitchClass: 2, octave: 2, displayName: 'D2' },
    { stringIndex: 1, pitchClass: 9, octave: 2, displayName: 'A2' },
    { stringIndex: 2, pitchClass: 2, octave: 3, displayName: 'D3' },
    { stringIndex: 3, pitchClass: 7, octave: 3, displayName: 'G3' },
    { stringIndex: 4, pitchClass: 11, octave: 3, displayName: 'B3' },
    { stringIndex: 5, pitchClass: 4, octave: 4, displayName: 'e4' },
  ],
};

export const OPEN_G: TuningConfig = {
  name: 'Open G (DGDGBd)',
  strings: [
    { stringIndex: 0, pitchClass: 2, octave: 2, displayName: 'D2' },
    { stringIndex: 1, pitchClass: 7, octave: 2, displayName: 'G2' },
    { stringIndex: 2, pitchClass: 2, octave: 3, displayName: 'D3' },
    { stringIndex: 3, pitchClass: 7, octave: 3, displayName: 'G3' },
    { stringIndex: 4, pitchClass: 11, octave: 3, displayName: 'B3' },
    { stringIndex: 5, pitchClass: 2, octave: 4, displayName: 'd4' },
  ],
};

export const OPEN_E: TuningConfig = {
  name: 'Open E (EBE G#Be)',
  strings: [
    { stringIndex: 0, pitchClass: 4, octave: 2, displayName: 'E2' },
    { stringIndex: 1, pitchClass: 11, octave: 2, displayName: 'B2' },
    { stringIndex: 2, pitchClass: 4, octave: 3, displayName: 'E3' },
    { stringIndex: 3, pitchClass: 8, octave: 3, displayName: 'G#3' },
    { stringIndex: 4, pitchClass: 11, octave: 3, displayName: 'B3' },
    { stringIndex: 5, pitchClass: 4, octave: 4, displayName: 'e4' },
  ],
};

export const DADGAD: TuningConfig = {
  name: 'DADGAD',
  strings: [
    { stringIndex: 0, pitchClass: 2, octave: 2, displayName: 'D2' },
    { stringIndex: 1, pitchClass: 9, octave: 2, displayName: 'A2' },
    { stringIndex: 2, pitchClass: 2, octave: 3, displayName: 'D3' },
    { stringIndex: 3, pitchClass: 7, octave: 3, displayName: 'G3' },
    { stringIndex: 4, pitchClass: 9, octave: 3, displayName: 'A3' },
    { stringIndex: 5, pitchClass: 2, octave: 4, displayName: 'd4' },
  ],
};

export const STANDARD_7: TuningConfig = {
  name: 'Standard 7-String (BEADGBe)',
  strings: [
    { stringIndex: 0, pitchClass: 11, octave: 1, displayName: 'B1' },
    { stringIndex: 1, pitchClass: 4, octave: 2, displayName: 'E2' },
    { stringIndex: 2, pitchClass: 9, octave: 2, displayName: 'A2' },
    { stringIndex: 3, pitchClass: 2, octave: 3, displayName: 'D3' },
    { stringIndex: 4, pitchClass: 7, octave: 3, displayName: 'G3' },
    { stringIndex: 5, pitchClass: 11, octave: 3, displayName: 'B3' },
    { stringIndex: 6, pitchClass: 4, octave: 4, displayName: 'e4' },
  ],
};

export const STANDARD_8: TuningConfig = {
  name: 'Standard 8-String (F#BEADGBe)',
  strings: [
    { stringIndex: 0, pitchClass: 6, octave: 1, displayName: 'F#1' },
    { stringIndex: 1, pitchClass: 11, octave: 1, displayName: 'B1' },
    { stringIndex: 2, pitchClass: 4, octave: 2, displayName: 'E2' },
    { stringIndex: 3, pitchClass: 9, octave: 2, displayName: 'A2' },
    { stringIndex: 4, pitchClass: 2, octave: 3, displayName: 'D3' },
    { stringIndex: 5, pitchClass: 7, octave: 3, displayName: 'G3' },
    { stringIndex: 6, pitchClass: 11, octave: 3, displayName: 'B3' },
    { stringIndex: 7, pitchClass: 4, octave: 4, displayName: 'e4' },
  ],
};

export const PRESET_TUNINGS_6: TuningConfig[] = [
  STANDARD_6,
  DROP_D,
  OPEN_G,
  OPEN_E,
  DADGAD,
];

export const PRESET_TUNINGS_7: TuningConfig[] = [STANDARD_7];
export const PRESET_TUNINGS_8: TuningConfig[] = [STANDARD_8];

export function getPresetsForStringCount(n: 6 | 7 | 8): TuningConfig[] {
  if (n === 7) return PRESET_TUNINGS_7;
  if (n === 8) return PRESET_TUNINGS_8;
  return PRESET_TUNINGS_6;
}
