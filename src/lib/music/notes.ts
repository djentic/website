import type { PitchClass, NoteSpelling, AccidentalPreference } from '../../types';

export const SHARP_NAMES: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const FLAT_NAMES: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Natural notes always prefer their natural name
const NATURAL_PCS: Set<number> = new Set([0, 2, 4, 5, 7, 9, 11]);

export function pitchClassToName(pc: PitchClass, pref: AccidentalPreference = 'sharp'): string {
  return pref === 'flat' ? FLAT_NAMES[pc] : SHARP_NAMES[pc];
}

export function nameToSpelling(name: string): NoteSpelling | null {
  const idx = SHARP_NAMES.indexOf(name);
  if (idx !== -1) return { pitchClass: idx as PitchClass, name };
  const idx2 = FLAT_NAMES.indexOf(name);
  if (idx2 !== -1) return { pitchClass: idx2 as PitchClass, name };
  return null;
}

export function spellNote(pc: PitchClass, pref: AccidentalPreference = 'sharp'): NoteSpelling {
  return { pitchClass: pc, name: pitchClassToName(pc, pref) };
}

// For a given key root and quality, determine if sharps or flats are preferred
export function keyAccidentalPref(rootPc: PitchClass, quality: 'major' | 'minor'): AccidentalPreference {
  // Major keys that prefer flats: F, Bb, Eb, Ab, Db, Gb
  // Minor keys that prefer flats: d, g, c, f, bb, eb
  const flatMajorRoots = new Set([5, 10, 3, 8, 1, 6]);   // F Bb Eb Ab Db Gb
  const flatMinorRoots = new Set([2, 7, 0, 5, 10, 3]);   // D G C F Bb Eb
  if (quality === 'major') return flatMajorRoots.has(rootPc) ? 'flat' : 'sharp';
  return flatMinorRoots.has(rootPc) ? 'flat' : 'sharp';
}

export function addSemitones(pc: PitchClass, semitones: number): PitchClass {
  return (((pc + semitones) % 12) + 12) % 12 as PitchClass;
}

export function semitoneDistance(from: PitchClass, to: PitchClass): number {
  return (((to - from) % 12) + 12) % 12;
}

export function isNatural(pc: PitchClass): boolean {
  return NATURAL_PCS.has(pc);
}

export function pitchClassesEqual(a: PitchClass[], b: PitchClass[]): boolean {
  const sa = new Set(a);
  const sb = new Set(b);
  if (sa.size !== sb.size) return false;
  for (const v of sa) if (!sb.has(v)) return false;
  return true;
}

// All note names for a pitch class (sharp + flat if different)
export function allNamesForPc(pc: PitchClass): string[] {
  const sharp = SHARP_NAMES[pc];
  const flat = FLAT_NAMES[pc];
  if (sharp === flat) return [sharp];
  return [sharp, flat];
}
