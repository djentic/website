import type { PitchClass, ChordResult, ChordInterpretation, NoteSpelling } from '../../types';
import { CHORD_FORMULAS } from '../../data/chords';
import { semitoneDistance, spellNote, keyAccidentalPref } from './notes';
import { intervalShortName } from './intervals';

// Normalize intervals of a selected set relative to a root
function intervalsFromRoot(root: PitchClass, pcs: PitchClass[]): number[] {
  return pcs.map((pc) => semitoneDistance(root, pc));
}

// Score how well a set of intervals matches a chord formula
// Returns confidence 0–1. Penalises missing tones, rewards exact match.
function scoreMatch(selectedIntervals: number[], formulaIntervals: number[]): number {
  // Reduce compound intervals (9→2, 11→4, 13→6)
  const normalized = selectedIntervals.map((i) => i % 12);
  const formulaNorm = formulaIntervals.map((i) => i % 12);

  const formulaSet = new Set(formulaNorm);
  const selectedSet = new Set(normalized);

  let matched = 0;
  for (const fi of formulaSet) {
    if (selectedSet.has(fi)) matched++;
  }

  // Extra notes not in formula reduce confidence slightly
  let extra = 0;
  for (const si of selectedSet) {
    if (!formulaSet.has(si)) extra++;
  }

  const coverage = matched / formulaSet.size;
  const penalty = extra * 0.1;
  return Math.max(0, coverage - penalty);
}

export function detectChords(selectedPcs: PitchClass[]): ChordResult {
  if (selectedPcs.length === 0) {
    return { pitchClasses: [], interpretations: [] };
  }

  const interpretations: ChordInterpretation[] = [];

  // Try each pitch class as potential root
  for (const rootPc of selectedPcs) {
    const intervals = intervalsFromRoot(rootPc, selectedPcs);

    for (const formula of CHORD_FORMULAS) {
      const score = scoreMatch(intervals, formula.intervals);
      if (score < 0.75) continue; // require at least 75% match

      const pref = keyAccidentalPref(rootPc, formula.quality === 'major' || formula.quality === 'dominant' ? 'major' : 'minor');
      const root: NoteSpelling = spellNote(rootPc, pref);

      // Build interval labels for each selected PC
      const intervalLabels = selectedPcs.map((pc) => {
        const semis = semitoneDistance(rootPc, pc);
        return intervalShortName(semis);
      });

      // Chord name: root + symbol
      const name = root.name + formula.symbol;

      // Confidence is score adjusted by formula priority
      const confidence = score * (1 - (formula.priority - 1) * 0.05);

      interpretations.push({
        root,
        formula,
        name,
        intervals: intervalLabels,
        confidence,
      });
    }
  }

  // Sort: confidence desc, then priority asc
  interpretations.sort((a, b) => {
    if (Math.abs(a.confidence - b.confidence) > 0.01) return b.confidence - a.confidence;
    return a.formula.priority - b.formula.priority;
  });

  return { pitchClasses: selectedPcs, interpretations: interpretations.slice(0, 8) };
}

export function chordPitchClasses(rootPc: PitchClass, formulaIntervals: number[]): PitchClass[] {
  return formulaIntervals.map((i) => (((rootPc + i) % 12) + 12) % 12 as PitchClass);
}

// Parse a chord name like "Cmaj7", "Am", "F#7" into root + formula
export function parseChordName(input: string): { rootPc: PitchClass; formula: (typeof CHORD_FORMULAS)[0] } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try two-character root first (C#, Db, etc.) then one-char
  const twoChar = trimmed.slice(0, 2);
  const oneChar = trimmed.slice(0, 1);

  let root: NoteSpelling | null = null;
  let suffix = '';

  // Dynamic import avoided — inline search
  const { SHARP_NAMES, FLAT_NAMES } = (() => {
    const S = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    const F = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
    return { SHARP_NAMES: S, FLAT_NAMES: F };
  })();

  const tryName = (name: string): NoteSpelling | null => {
    const si = SHARP_NAMES.indexOf(name);
    if (si !== -1) return { pitchClass: si as PitchClass, name };
    const fi = FLAT_NAMES.indexOf(name);
    if (fi !== -1) return { pitchClass: fi as PitchClass, name };
    return null;
  };

  root = tryName(twoChar);
  if (root) {
    suffix = trimmed.slice(2);
  } else {
    root = tryName(oneChar.toUpperCase());
    if (root) suffix = trimmed.slice(1);
  }

  if (!root) return null;

  // Normalize suffix: lowercase first char of suffix if needed
  // Try to match suffix against symbols
  const formula = CHORD_FORMULAS.find(
    (f) => f.symbol.toLowerCase() === suffix.toLowerCase()
  ) ?? (suffix === '' ? CHORD_FORMULAS.find((f) => f.symbol === '') : null);

  if (!formula) return null;
  return { rootPc: root.pitchClass, formula };
}
