// Pitch class: 0=C, 1=C#/Db, ..., 11=B
export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type AccidentalPreference = 'sharp' | 'flat';

export interface NoteSpelling {
  pitchClass: PitchClass;
  name: string; // e.g. "C#", "Db", "E"
}

// string index: 0 = lowest string
export interface StringTuning {
  stringIndex: number;
  pitchClass: PitchClass;
  octave: number; // MIDI octave, for display reference
  displayName: string; // e.g. "E2"
}

export interface TuningConfig {
  name: string;
  strings: StringTuning[];
}

export interface FretPosition {
  stringIndex: number;
  fret: number;
}

export interface FretNote {
  position: FretPosition;
  pitchClass: PitchClass;
  noteName: string;
  octave: number;
}

export type StringCount = 4 | 5 | 6 | 7 | 8;
export type InstrumentType = 'guitar' | 'bass';

// Intervals (semitones from root)
export type IntervalSemitones = number;

export interface IntervalInfo {
  semitones: IntervalSemitones;
  shortName: string; // "P1", "M3", "m7" etc.
  longName: string;  // "Perfect Unison", "Major Third" etc.
}

export interface ChordFormula {
  name: string;       // "Major", "Minor 7th" etc.
  symbol: string;     // "maj", "m7" etc.
  intervals: number[]; // semitones from root, sorted
  quality: ChordQuality;
  priority: number;   // lower = more common, shown first
}

export type ChordQuality =
  | 'major'
  | 'minor'
  | 'diminished'
  | 'augmented'
  | 'suspended'
  | 'power'
  | 'dominant'
  | 'extended'
  | 'added';

export interface ChordInterpretation {
  root: NoteSpelling;
  formula: ChordFormula;
  name: string;       // full chord name, e.g. "Cmaj7"
  intervals: string[]; // interval labels for each selected PC
  confidence: number; // 0–1, higher = more likely
  bass?: NoteSpelling; // if slash chord
}

export interface ChordResult {
  pitchClasses: PitchClass[];
  interpretations: ChordInterpretation[];
}

export type ScaleDegree = number; // 1-based index within the scale

export interface ScaleFormula {
  name: string;
  intervals: number[]; // semitone offsets from root (any length)
  quality: 'major' | 'minor';
  // optional display labels per interval; falls back to sequential 1-N
  degrees?: (string | number)[];
}

export interface KeyInfo {
  root: NoteSpelling;
  formula: ScaleFormula;
  pitchClasses: PitchClass[];
  // map pitchClass → degree label
  degreeMap: Map<PitchClass, ScaleDegree>;
}

export interface ScalePosition {
  index: number;   // 1-based position number (1 = root box)
  minFret: number;
  maxFret: number;
  label: string;   // "1", "2", …
}

export type HarmonicFunction = 'tonic' | 'predominant' | 'dominant' | 'subdominant';

export interface ProgressionSuggestion {
  chord: string;       // e.g. "Am"
  root: NoteSpelling;
  formula: ChordFormula;
  feel: string;        // plain language: "resolved / stable"
  function: HarmonicFunction;
  reasoning: string;   // "diatonic ii chord in C major"
  romanNumeral: string; // "ii"
}

export type VoicingGroup = 'open' | 'movable' | 'triad' | 'extended';

export interface Voicing {
  positions: FretPosition[]; // one per string (null strings are skipped)
  group: VoicingGroup;
  label: string;
  fretSpan: number;
}

export interface AppMode {
  type: 'select' | 'chord' | 'key';
}

export type NoteRole =
  | 'root'
  | 'chord-tone'
  | 'scale-degree'
  | 'selected'
  | 'none';

export interface FretCellInfo {
  fretNote: FretNote;
  role: NoteRole;
  degree?: ScaleDegree;
  intervalLabel?: string;
  isSelected: boolean;
}
