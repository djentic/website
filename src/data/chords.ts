import type { ChordFormula } from '../types';

// Intervals are semitones from root (root=0 always implied)
export const CHORD_FORMULAS: ChordFormula[] = [
  // Power
  { name: 'Power', symbol: '5', intervals: [0, 7], quality: 'power', priority: 5 },

  // Triads
  { name: 'Major', symbol: '', intervals: [0, 4, 7], quality: 'major', priority: 1 },
  { name: 'Minor', symbol: 'm', intervals: [0, 3, 7], quality: 'minor', priority: 1 },
  { name: 'Diminished', symbol: 'dim', intervals: [0, 3, 6], quality: 'diminished', priority: 2 },
  { name: 'Augmented', symbol: 'aug', intervals: [0, 4, 8], quality: 'augmented', priority: 2 },
  { name: 'Suspended 2', symbol: 'sus2', intervals: [0, 2, 7], quality: 'suspended', priority: 3 },
  { name: 'Suspended 4', symbol: 'sus4', intervals: [0, 5, 7], quality: 'suspended', priority: 3 },

  // 6th chords
  { name: 'Major 6', symbol: '6', intervals: [0, 4, 7, 9], quality: 'major', priority: 4 },
  { name: 'Minor 6', symbol: 'm6', intervals: [0, 3, 7, 9], quality: 'minor', priority: 4 },

  // 7th chords
  { name: 'Dominant 7', symbol: '7', intervals: [0, 4, 7, 10], quality: 'dominant', priority: 2 },
  { name: 'Major 7', symbol: 'maj7', intervals: [0, 4, 7, 11], quality: 'major', priority: 2 },
  { name: 'Minor 7', symbol: 'm7', intervals: [0, 3, 7, 10], quality: 'minor', priority: 2 },
  { name: 'Minor Major 7', symbol: 'mM7', intervals: [0, 3, 7, 11], quality: 'minor', priority: 4 },
  { name: 'Diminished 7', symbol: 'dim7', intervals: [0, 3, 6, 9], quality: 'diminished', priority: 3 },
  { name: 'Half Diminished 7', symbol: 'm7b5', intervals: [0, 3, 6, 10], quality: 'diminished', priority: 3 },
  { name: 'Augmented 7', symbol: 'aug7', intervals: [0, 4, 8, 10], quality: 'augmented', priority: 5 },

  // Add chords
  { name: 'Add 9', symbol: 'add9', intervals: [0, 4, 7, 14], quality: 'added', priority: 3 },
  { name: 'Minor Add 9', symbol: 'madd9', intervals: [0, 3, 7, 14], quality: 'added', priority: 4 },

  // 9th chords
  { name: 'Dominant 9', symbol: '9', intervals: [0, 4, 7, 10, 14], quality: 'dominant', priority: 4 },
  { name: 'Major 9', symbol: 'maj9', intervals: [0, 4, 7, 11, 14], quality: 'major', priority: 4 },
  { name: 'Minor 9', symbol: 'm9', intervals: [0, 3, 7, 10, 14], quality: 'minor', priority: 4 },

  // Sus7
  { name: 'Dominant 7 Sus4', symbol: '7sus4', intervals: [0, 5, 7, 10], quality: 'suspended', priority: 4 },
];
