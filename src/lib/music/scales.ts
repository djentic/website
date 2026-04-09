import type { PitchClass, KeyInfo, ScaleDegree, NoteSpelling, ChordFormula } from '../../types';
import { MAJOR_FORMULA, NATURAL_MINOR_FORMULA } from '../../data/scales';
import { CHORD_FORMULAS } from '../../data/chords';
import type { ScaleFormula } from '../../types';
import { addSemitones, spellNote, keyAccidentalPref } from './notes';
import { chordPitchClasses } from './chords';

export function buildKey(rootPc: PitchClass, formula: ScaleFormula): KeyInfo {
  const pref = keyAccidentalPref(rootPc, formula.quality);
  const root: NoteSpelling = spellNote(rootPc, pref);

  const pitchClasses: PitchClass[] = formula.intervals.map((i) =>
    addSemitones(rootPc, i)
  );

  const degreeMap = new Map<PitchClass, ScaleDegree>();
  formula.intervals.forEach((_, idx) => {
    const label = formula.degrees ? formula.degrees[idx] : idx + 1;
    degreeMap.set(pitchClasses[idx], label as ScaleDegree);
  });

  return { root, formula, pitchClasses, degreeMap };
}

export function buildMajorKey(rootPc: PitchClass): KeyInfo {
  return buildKey(rootPc, MAJOR_FORMULA);
}

export function buildMinorKey(rootPc: PitchClass): KeyInfo {
  return buildKey(rootPc, NATURAL_MINOR_FORMULA);
}

// Returns degree label like "1", "b3", "#4" etc. for display
export function degreeLabel(degree: ScaleDegree): string {
  return String(degree);
}

// Check if a set of pitch classes is fully contained in a key
export function isChordDiatonic(chordPcs: PitchClass[], key: KeyInfo): boolean {
  const keySet = new Set(key.pitchClasses);
  return chordPcs.every((pc) => keySet.has(pc));
}

// Return all 12 major keys
export function allMajorKeys(): KeyInfo[] {
  return Array.from({ length: 12 }, (_, i) => buildMajorKey(i as PitchClass));
}

// Return all 12 natural minor keys
export function allMinorKeys(): KeyInfo[] {
  return Array.from({ length: 12 }, (_, i) => buildMinorKey(i as PitchClass));
}

// Chord formulas to try when deriving diatonic chords (triads + common 7ths, by priority)
const DIATONIC_FORMULA_SYMBOLS = ['', 'm', 'dim', 'aug', 'maj7', 'm7', '7', 'm7b5', 'dim7', 'sus2', 'sus4'];

export interface DiatonicChord {
  rootPc: PitchClass;
  formula: ChordFormula;
  name: string;
}

// Find all chords whose tones are entirely within the given key
export function diatonicChords(key: KeyInfo): DiatonicChord[] {
  const keySet = new Set(key.pitchClasses);
  const pref = keyAccidentalPref(key.root.pitchClass, key.formula.quality);
  const results: DiatonicChord[] = [];
  const seen = new Set<string>();

  const formulas = CHORD_FORMULAS.filter((f) => DIATONIC_FORMULA_SYMBOLS.includes(f.symbol));

  for (const rootPc of key.pitchClasses) {
    for (const formula of formulas) {
      const pcs = chordPitchClasses(rootPc, formula.intervals);
      if (pcs.every((pc) => keySet.has(pc as PitchClass))) {
        const root = spellNote(rootPc, pref);
        const name = root.name + formula.symbol;
        if (!seen.has(name)) {
          seen.add(name);
          results.push({ rootPc, formula, name });
        }
      }
    }
  }

  // Sort by scale degree order then formula priority
  const degreeOrder = key.pitchClasses;
  results.sort((a, b) => {
    const ai = degreeOrder.indexOf(a.rootPc);
    const bi = degreeOrder.indexOf(b.rootPc);
    if (ai !== bi) return ai - bi;
    return a.formula.priority - b.formula.priority;
  });

  return results;
}

// Keys that contain all pitchclasses of a chord, ranked
export function compatibleKeys(
  chordPcs: PitchClass[]
): { key: KeyInfo; diatonic: boolean; borrowedTones: number }[] {
  const results = [];
  for (const key of [...allMajorKeys(), ...allMinorKeys()]) {
    const keySet = new Set(key.pitchClasses);
    let matched = 0;
    for (const pc of chordPcs) {
      if (keySet.has(pc)) matched++;
    }
    const diatonic = matched === chordPcs.length;
    const borrowedTones = chordPcs.length - matched;
    results.push({ key, diatonic, borrowedTones });
  }
  return results
    .filter((r) => r.borrowedTones <= 1)
    .sort((a, b) => a.borrowedTones - b.borrowedTones);
}
