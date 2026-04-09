import type { ScaleFormula } from '../types';

export const SCALE_FORMULAS: ScaleFormula[] = [
  // ── Diatonic modes ──────────────────────────────────────────────────
  {
    name: 'Major (Ionian)',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    quality: 'major',
  },
  {
    name: 'Natural Minor (Aeolian)',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    quality: 'minor',
  },
  {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    quality: 'minor',
  },
  {
    name: 'Phrygian',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    quality: 'minor',
    degrees: [1, 'b2', 'b3', 4, 5, 'b6', 'b7'],
  },
  {
    name: 'Phrygian Dominant',
    intervals: [0, 1, 4, 5, 7, 8, 10],
    quality: 'minor',
    degrees: [1, 'b2', 3, 4, 5, 'b6', 'b7'],
  },
  {
    name: 'Lydian',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    quality: 'major',
    degrees: [1, 2, 3, '#4', 5, 6, 7],
  },
  {
    name: 'Mixolydian',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    quality: 'major',
    degrees: [1, 2, 3, 4, 5, 6, 'b7'],
  },

  // ── Pentatonic & blues ───────────────────────────────────────────────
  {
    name: 'Major Pentatonic',
    intervals: [0, 2, 4, 7, 9],
    quality: 'major',
    degrees: [1, 2, 3, 5, 6],
  },
  {
    name: 'Minor Pentatonic',
    intervals: [0, 3, 5, 7, 10],
    quality: 'minor',
    degrees: [1, 'b3', 4, 5, 'b7'],
  },
  {
    name: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10],
    quality: 'minor',
    degrees: [1, 'b3', 4, 'b5', 5, 'b7'],
  },

  // ── Symmetric ────────────────────────────────────────────────────────
  {
    name: 'Diminished (W-H)',
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    quality: 'minor',
    degrees: [1, 2, 'b3', 4, 'b5', '#5', 6, 7],
  },
];

export const MAJOR_FORMULA = SCALE_FORMULAS[0];
export const NATURAL_MINOR_FORMULA = SCALE_FORMULAS[1];
