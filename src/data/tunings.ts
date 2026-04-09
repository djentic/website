import type { TuningConfig, StringCount, InstrumentType } from '../types';

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

// ===== Bass tunings =====
// Bass strings are ~one octave lower than guitar; octave numbers reflect scientific pitch

export const BASS_4_STANDARD: TuningConfig = {
  name: 'Bass 4-String (EADG)',
  strings: [
    { stringIndex: 0, pitchClass: 4, octave: 1, displayName: 'E1' },
    { stringIndex: 1, pitchClass: 9, octave: 1, displayName: 'A1' },
    { stringIndex: 2, pitchClass: 2, octave: 2, displayName: 'D2' },
    { stringIndex: 3, pitchClass: 7, octave: 2, displayName: 'G2' },
  ],
};

export const BASS_4_DROP_D: TuningConfig = {
  name: 'Bass 4-String Drop D (DADG)',
  strings: [
    { stringIndex: 0, pitchClass: 2, octave: 1, displayName: 'D1' },
    { stringIndex: 1, pitchClass: 9, octave: 1, displayName: 'A1' },
    { stringIndex: 2, pitchClass: 2, octave: 2, displayName: 'D2' },
    { stringIndex: 3, pitchClass: 7, octave: 2, displayName: 'G2' },
  ],
};

export const BASS_5_STANDARD: TuningConfig = {
  name: 'Bass 5-String (BEADG)',
  strings: [
    { stringIndex: 0, pitchClass: 11, octave: 0, displayName: 'B0' },
    { stringIndex: 1, pitchClass: 4,  octave: 1, displayName: 'E1' },
    { stringIndex: 2, pitchClass: 9,  octave: 1, displayName: 'A1' },
    { stringIndex: 3, pitchClass: 2,  octave: 2, displayName: 'D2' },
    { stringIndex: 4, pitchClass: 7,  octave: 2, displayName: 'G2' },
  ],
};

// Drop A: lowest string tuned down 2 semitones from B to A (same interval drop as guitar drop D)
export const BASS_5_DROP_A: TuningConfig = {
  name: 'Bass 5-String Drop A (AEADG)',
  strings: [
    { stringIndex: 0, pitchClass: 9,  octave: 0, displayName: 'A0' },
    { stringIndex: 1, pitchClass: 4,  octave: 1, displayName: 'E1' },
    { stringIndex: 2, pitchClass: 9,  octave: 1, displayName: 'A1' },
    { stringIndex: 3, pitchClass: 2,  octave: 2, displayName: 'D2' },
    { stringIndex: 4, pitchClass: 7,  octave: 2, displayName: 'G2' },
  ],
};

export const BASS_6_STANDARD: TuningConfig = {
  name: 'Bass 6-String (BEADGC)',
  strings: [
    { stringIndex: 0, pitchClass: 11, octave: 0, displayName: 'B0' },
    { stringIndex: 1, pitchClass: 4,  octave: 1, displayName: 'E1' },
    { stringIndex: 2, pitchClass: 9,  octave: 1, displayName: 'A1' },
    { stringIndex: 3, pitchClass: 2,  octave: 2, displayName: 'D2' },
    { stringIndex: 4, pitchClass: 7,  octave: 2, displayName: 'G2' },
    { stringIndex: 5, pitchClass: 0,  octave: 3, displayName: 'C3' },
  ],
};

export const PRESET_TUNINGS_BASS_4: TuningConfig[] = [BASS_4_STANDARD, BASS_4_DROP_D];
export const PRESET_TUNINGS_BASS_5: TuningConfig[] = [BASS_5_STANDARD, BASS_5_DROP_A];
export const PRESET_TUNINGS_BASS_6: TuningConfig[] = [BASS_6_STANDARD];

export function getPresetsForStringCount(n: StringCount, instrument: InstrumentType = 'guitar'): TuningConfig[] {
  if (n === 4) return PRESET_TUNINGS_BASS_4;
  if (n === 5) return PRESET_TUNINGS_BASS_5;
  if (n === 7) return PRESET_TUNINGS_7;
  if (n === 8) return PRESET_TUNINGS_8;
  // n === 6
  return instrument === 'bass' ? PRESET_TUNINGS_BASS_6 : PRESET_TUNINGS_6;
}
