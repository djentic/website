import type {
  TuningConfig,
  FretPosition,
  PitchClass,
  Voicing,
  VoicingGroup,
  ChordFormula,
} from '../../types';
import { addSemitones } from './notes';
import { chordPitchClasses } from './chords';

interface StringFretOptions {
  stringIndex: number;
  frets: { fret: number; pc: PitchClass }[];
}

// For each string, find frets where chord tones appear within a range
function optionsPerString(
  tuning: TuningConfig,
  chordPcs: Set<PitchClass>,
  minFret: number,
  maxFret: number
): StringFretOptions[] {
  return tuning.strings.map((str) => {
    const frets: { fret: number; pc: PitchClass }[] = [];
    for (let f = minFret; f <= maxFret; f++) {
      const pc = addSemitones(str.pitchClass, f);
      if (chordPcs.has(pc)) {
        frets.push({ fret: f, pc });
      }
    }
    return { stringIndex: str.stringIndex, frets };
  });
}

// Generate voicings by searching for playable clusters
export function generateVoicings(
  rootPc: PitchClass,
  formula: ChordFormula,
  tuning: TuningConfig,
  maxFretSpan = 4
): Voicing[] {
  const chordPcs = new Set(chordPitchClasses(rootPc, formula.intervals));
  const voicings: Voicing[] = [];

  // Search in three zones: open (0-4), middle (4-9), upper (9-15)
  const zones: { minFret: number; maxFret: number; group: VoicingGroup }[] = [
    { minFret: 0, maxFret: 5, group: 'open' },
    { minFret: 3, maxFret: 10, group: 'movable' },
    { minFret: 7, maxFret: 14, group: 'movable' },
  ];

  for (const zone of zones) {
    const options = optionsPerString(tuning, chordPcs, zone.minFret, zone.maxFret);

    // Try combinations: pick one fret per string (or skip string)
    // Use a greedy approach per string subset for performance
    const stringCount = tuning.strings.length;
    const candidateVoicings = buildCandidates(options, stringCount, maxFretSpan, rootPc);

    for (const candidate of candidateVoicings) {
      const frets = candidate.map((p) => p.fret);
      const playedFrets = frets.filter((f) => f > 0);
      const fretSpan = playedFrets.length > 0
        ? Math.max(...playedFrets) - Math.min(...playedFrets)
        : 0;

      voicings.push({
        positions: candidate,
        group: zone.group,
        label: zone.group === 'open' ? 'Open' : `Fret ${Math.min(...playedFrets)}`,
        fretSpan,
      });
    }
  }

  // Deduplicate by position signature
  const seen = new Set<string>();
  return voicings.filter((v) => {
    const key = v.positions.map((p) => `${p.stringIndex}:${p.fret}`).join(',');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 12);
}

function buildCandidates(
  options: StringFretOptions[],
  stringCount: number,
  maxFretSpan: number,
  rootPc: PitchClass
): FretPosition[][] {
  const results: FretPosition[][] = [];

  // Simple depth-first search with pruning
  function dfs(
    stringIdx: number,
    current: FretPosition[],
    currentMin: number,
    currentMax: number,
    coveredPcs: Set<PitchClass>
  ) {
    if (results.length >= 6) return; // limit per zone

    if (stringIdx === stringCount) {
      // Must cover root and at least one other chord tone, min 2 notes
      if (current.length < 2) return;
      if (!coveredPcs.has(rootPc)) return;
      if (coveredPcs.size < 2) return;
      results.push([...current]);
      return;
    }

    const strOptions = options[stringIdx];

    // Option 1: skip this string
    dfs(stringIdx + 1, current, currentMin, currentMax, coveredPcs);

    // Option 2: play a fret on this string
    for (const { fret, pc } of strOptions.frets) {
      const newMin = current.length === 0 || fret === 0 ? currentMin : Math.min(currentMin, fret > 0 ? fret : currentMin);
      const newMax = fret === 0 ? currentMax : Math.max(currentMax, fret);
      const span = newMax > 0 && newMin > 0 && newMax !== Infinity ? newMax - newMin : 0;

      if (span > maxFretSpan) continue;

      const newCovered = new Set(coveredPcs);
      newCovered.add(pc);

      dfs(
        stringIdx + 1,
        [...current, { stringIndex: stringIdx, fret }],
        fret === 0 ? currentMin : Math.min(currentMin === Infinity ? fret : currentMin, fret),
        Math.max(currentMax, fret),
        newCovered
      );
    }
  }

  dfs(0, [], Infinity, 0, new Set());
  return results;
}
