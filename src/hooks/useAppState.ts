import { useState, useCallback, useMemo } from 'react';
import type {
  TuningConfig,
  StringCount,
  FretPosition,
  ChordResult,
  KeyInfo,
  PitchClass,
  ChordInterpretation,
  ScalePosition,
  InstrumentType,
  Voicing,
  ChordFormula,
} from '../types';
import { STANDARD_6, STANDARD_7, STANDARD_8, BASS_4_STANDARD, BASS_5_STANDARD, BASS_6_STANDARD } from '../data/tunings';
import { detectChords } from '../lib/music/chords';
import { generateFretboard, pitchClassesAtPositions, computePositions } from '../lib/music/fretboard';
import { buildKey } from '../lib/music/scales';
import { suggestProgressions } from '../lib/music/harmony';
import { generateVoicings } from '../lib/music/voicings';
import type { ProgressionSuggestion, ScaleFormula } from '../types';

export type AppMode = 'select' | 'chord' | 'key';

function defaultTuning(count: StringCount, instrument: InstrumentType = 'guitar'): TuningConfig {
  if (count === 4) return BASS_4_STANDARD;
  if (count === 5) return BASS_5_STANDARD;
  if (count === 7) return STANDARD_7;
  if (count === 8) return STANDARD_8;
  // count === 6
  return instrument === 'bass' ? BASS_6_STANDARD : STANDARD_6;
}

export interface SecondaryChord {
  name: string;
  pcs: PitchClass[];
  rootPc: PitchClass;
  formula: ChordFormula;
}

export interface AppState {
  stringCount: StringCount;
  tuning: TuningConfig;
  fretCount: number;
  selectedPositions: FretPosition[];
  mode: AppMode;
  chordResult: ChordResult | null;
  activeVoicingPcs: PitchClass[] | null;
  activeKey: KeyInfo | null;
  activeScalePosition: ScalePosition | null;
  scalePositions: ScalePosition[];
  progressionSuggestions: ProgressionSuggestion[];
  topChord: ChordInterpretation | null;
  voicings: Voicing[];
  activeVoicing: Voicing | null;
  activeChordRootPc: PitchClass | null;
  secondaryChord: SecondaryChord | null;
  secondaryVoicings: Voicing[];
  secondaryVoicing: Voicing | null;
}

export interface AppActions {
  setStringCount: (n: StringCount, instrument?: InstrumentType) => void;
  setTuning: (t: TuningConfig) => void;
  setFretCount: (n: number) => void;
  togglePosition: (pos: FretPosition) => void;
  clearSelection: () => void;
  setMode: (m: AppMode) => void;
  setActiveVoicingPcs: (pcs: PitchClass[] | null) => void;
  setActiveKey: (key: KeyInfo | null) => void;
  setKey: (rootPc: PitchClass, formula: ScaleFormula) => void;
  setActiveScalePosition: (pos: ScalePosition | null) => void;
  setActiveChord: (pcs: PitchClass[] | null, rootPc: PitchClass | null, formula: ChordFormula | null) => void;
  setActiveVoicing: (v: Voicing | null) => void;
  setSecondaryChord: (chord: SecondaryChord | null) => void;
  setSecondaryVoicing: (v: Voicing | null) => void;
}

export function useAppState(): AppState & AppActions {
  const [stringCount, setStringCountState] = useState<StringCount>(6);
  const [tuning, setTuningState] = useState<TuningConfig>(STANDARD_6);
  const [fretCount, setFretCount] = useState(22);
  const [selectedPositions, setSelectedPositions] = useState<FretPosition[]>([]);
  const [mode, setMode] = useState<AppMode>('select');
  const [activeVoicingPcs, setActiveVoicingPcs] = useState<PitchClass[] | null>(null);
  const [activeKey, setActiveKey] = useState<KeyInfo | null>(null);
  const [activeScalePosition, setActiveScalePosition] = useState<ScalePosition | null>(null);
  const [activeChordRootPc, setActiveChordRootPc] = useState<PitchClass | null>(null);
  const [activeChordFormula, setActiveChordFormula] = useState<ChordFormula | null>(null);
  const [activeVoicing, setActiveVoicing] = useState<Voicing | null>(null);
  const [secondaryChord, setSecondaryChord] = useState<SecondaryChord | null>(null);
  const [secondaryVoicing, setSecondaryVoicing] = useState<Voicing | null>(null);

  // Derived state
  const grid = generateFretboard(tuning, fretCount);
  const selectedPcs = pitchClassesAtPositions(grid, selectedPositions);
  const chordResult = selectedPcs.length >= 2 ? detectChords(selectedPcs) : null;
  const topChord = chordResult?.interpretations[0] ?? null;
  const progressionSuggestions = topChord ? suggestProgressions(topChord) : [];

  const scalePositions = useMemo(
    () => activeKey ? computePositions(activeKey, tuning, fretCount) : [],
    [activeKey, tuning, fretCount]
  );

  const setStringCount = useCallback((n: StringCount, instrument: InstrumentType = 'guitar') => {
    setStringCountState(n);
    setTuningState(defaultTuning(n, instrument));
    setSelectedPositions([]);
  }, []);

  const setTuning = useCallback((t: TuningConfig) => {
    setTuningState(t);
    setSelectedPositions([]);
  }, []);

  const togglePosition = useCallback((pos: FretPosition) => {
    setSelectedPositions((prev) => {
      const idx = prev.findIndex(
        (p) => p.stringIndex === pos.stringIndex && p.fret === pos.fret
      );
      if (idx !== -1) return prev.filter((_, i) => i !== idx);
      return [...prev, pos];
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedPositions([]), []);

  const setKey = useCallback((rootPc: PitchClass, formula: ScaleFormula) => {
    setActiveKey(buildKey(rootPc, formula));
    setActiveScalePosition(null); // reset position when key changes
  }, []);

  const voicings = useMemo(() => {
    if (activeChordRootPc === null || !activeChordFormula) return [];
    return generateVoicings(activeChordRootPc, activeChordFormula, tuning);
  }, [activeChordRootPc, activeChordFormula, tuning]);

  const secondaryVoicings = useMemo(() => {
    if (!secondaryChord) return [];
    return generateVoicings(secondaryChord.rootPc, secondaryChord.formula, tuning);
  }, [secondaryChord, tuning]);

  const setActiveChord = useCallback((
    pcs: PitchClass[] | null,
    rootPc: PitchClass | null,
    formula: ChordFormula | null,
  ) => {
    setActiveVoicingPcs(pcs);
    setActiveChordRootPc(rootPc);
    setActiveChordFormula(formula);
    setActiveVoicing(null);
  }, []);

  const handleSetSecondaryChord = useCallback((chord: SecondaryChord | null) => {
    setSecondaryChord(chord);
    setSecondaryVoicing(null); // VoicingPicker will auto-select [0] via useEffect
  }, []);

  return {
    stringCount,
    tuning,
    fretCount,
    selectedPositions,
    mode,
    chordResult,
    activeVoicingPcs,
    activeKey,
    activeScalePosition,
    scalePositions,
    progressionSuggestions,
    topChord,
    voicings,
    activeVoicing,
    activeChordRootPc,
    secondaryChord,
    secondaryVoicings,
    secondaryVoicing,
    setStringCount,
    setTuning,
    setFretCount,
    togglePosition,
    clearSelection,
    setMode,
    setActiveVoicingPcs,
    setActiveKey,
    setKey,
    setActiveScalePosition,
    setActiveChord,
    setActiveVoicing,
    setSecondaryChord: handleSetSecondaryChord,
    setSecondaryVoicing,
  };
}
