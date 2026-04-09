import type { IntervalInfo } from '../../types';

const INTERVAL_TABLE: IntervalInfo[] = [
  { semitones: 0,  shortName: 'P1',  longName: 'Perfect Unison' },
  { semitones: 1,  shortName: 'm2',  longName: 'Minor 2nd' },
  { semitones: 2,  shortName: 'M2',  longName: 'Major 2nd' },
  { semitones: 3,  shortName: 'm3',  longName: 'Minor 3rd' },
  { semitones: 4,  shortName: 'M3',  longName: 'Major 3rd' },
  { semitones: 5,  shortName: 'P4',  longName: 'Perfect 4th' },
  { semitones: 6,  shortName: 'TT',  longName: 'Tritone' },
  { semitones: 7,  shortName: 'P5',  longName: 'Perfect 5th' },
  { semitones: 8,  shortName: 'm6',  longName: 'Minor 6th' },
  { semitones: 9,  shortName: 'M6',  longName: 'Major 6th' },
  { semitones: 10, shortName: 'm7',  longName: 'Minor 7th' },
  { semitones: 11, shortName: 'M7',  longName: 'Major 7th' },
  { semitones: 12, shortName: 'P8',  longName: 'Octave' },
  { semitones: 13, shortName: 'm9',  longName: 'Minor 9th' },
  { semitones: 14, shortName: 'M9',  longName: 'Major 9th (9)' },
  { semitones: 15, shortName: 'm10', longName: 'Minor 10th' },
  { semitones: 16, shortName: 'M10', longName: 'Major 10th' },
  { semitones: 17, shortName: 'P11', longName: 'Perfect 11th (11)' },
  { semitones: 18, shortName: 'A11', longName: 'Augmented 11th (#11)' },
  { semitones: 19, shortName: 'P12', longName: 'Perfect 12th' },
  { semitones: 21, shortName: 'M13', longName: 'Major 13th (13)' },
];

const BY_SEMITONES = new Map<number, IntervalInfo>(
  INTERVAL_TABLE.map((i) => [i.semitones, i])
);

export function getInterval(semitones: number): IntervalInfo {
  const normalized = ((semitones % 12) + 12) % 12;
  return BY_SEMITONES.get(normalized) ?? BY_SEMITONES.get(semitones) ?? {
    semitones,
    shortName: `+${semitones}`,
    longName: `${semitones} semitones`,
  };
}

export function intervalShortName(semitones: number): string {
  return getInterval(semitones).shortName;
}
