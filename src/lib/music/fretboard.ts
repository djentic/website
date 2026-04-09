import type { TuningConfig, FretNote, FretPosition, PitchClass, KeyInfo, ScalePosition } from '../../types';
import { addSemitones, pitchClassToName } from './notes';

export function noteAtFret(
  openPc: PitchClass,
  fret: number,
  pref: 'sharp' | 'flat' = 'sharp'
): { pitchClass: PitchClass; noteName: string; octave: number } {
  const pc = addSemitones(openPc, fret);
  return {
    pitchClass: pc,
    noteName: pitchClassToName(pc, pref),
    octave: 0, // simplified; full octave tracking not needed for display
  };
}

export function generateFretboard(
  tuning: TuningConfig,
  fretCount: number,
  pref: 'sharp' | 'flat' = 'sharp'
): FretNote[][] {
  // Returns [stringIndex][fret] = FretNote (fret 0 = open string)
  return tuning.strings.map((str) => {
    const notes: FretNote[] = [];
    for (let fret = 0; fret <= fretCount; fret++) {
      const pc = addSemitones(str.pitchClass, fret);
      const openOctave = str.octave;
      // Rough octave: every 12 semitones up adds 1
      const octave = openOctave + Math.floor((str.pitchClass + fret) / 12);
      notes.push({
        position: { stringIndex: str.stringIndex, fret },
        pitchClass: pc,
        noteName: pitchClassToName(pc, pref),
        octave,
      });
    }
    return notes;
  });
}

export function fretNotesAtPositions(
  grid: FretNote[][],
  positions: FretPosition[]
): FretNote[] {
  return positions.map((pos) => grid[pos.stringIndex]?.[pos.fret]).filter(Boolean) as FretNote[];
}

export function pitchClassesAtPositions(
  grid: FretNote[][],
  positions: FretPosition[]
): PitchClass[] {
  const pcs = fretNotesAtPositions(grid, positions).map((n) => n.pitchClass);
  return [...new Set(pcs)] as PitchClass[];
}

// Fret position markers (dots) for display
export const FRET_MARKERS: number[] = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
export const DOUBLE_MARKERS: number[] = [12, 24];

// Derive playable scale positions (boxes) from a key and tuning.
// Each position = a 4-fret hand span covering a distinct cluster of scale tones.
// Positions are numbered starting from the root box (Position 1 = box containing
// the root as lowest note on the lowest string).
export function computePositions(
  key: KeyInfo,
  tuning: TuningConfig,
  fretCount: number
): ScalePosition[] {
  const keySet = new Set(key.pitchClasses);
  const lowestString = tuning.strings[0];
  const SPAN = 4; // standard 4-fret hand span

  // Find frets on the lowest string where a scale tone appears (first octave only)
  const startFrets: number[] = [];
  for (let f = 0; f <= Math.min(11, fretCount); f++) {
    const pc = addSemitones(lowestString.pitchClass, f);
    if (keySet.has(pc)) startFrets.push(f);
  }

  if (startFrets.length === 0) return [];

  // Build raw boxes in fret order
  const boxes = startFrets.map((f) => ({ minFret: f, maxFret: f + SPAN }));

  // Re-number starting from the box whose window contains the root PC
  const rootPc = key.root.pitchClass;
  const rootFretOnLowest = startFrets.find((f) => addSemitones(lowestString.pitchClass, f) === rootPc);
  let offset = 0;
  if (rootFretOnLowest !== undefined) {
    offset = startFrets.indexOf(rootFretOnLowest);
  }

  return boxes.map((box, i) => {
    const posNum = ((i - offset + boxes.length) % boxes.length) + 1;
    return {
      index: posNum,
      minFret: box.minFret,
      maxFret: box.maxFret,
      label: String(posNum),
    };
  }).sort((a, b) => a.index - b.index);
}
