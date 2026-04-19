import type {
  PitchClass,
  ProgressionSuggestion,
  HarmonicFunction,
  NoteSpelling,
  ChordInterpretation,
} from '../../types';
import { CHORD_FORMULAS } from '../../data/chords';
import { buildMajorKey, buildMinorKey } from './scales';
import { addSemitones, spellNote, keyAccidentalPref } from './notes';

interface DiatonicChord {
  degree: number;       // 1-7
  roman: string;
  formulaSymbol: string;
  function: HarmonicFunction;
}

const MAJOR_DIATONIC: DiatonicChord[] = [
  { degree: 0,  roman: 'I',    formulaSymbol: '',    function: 'tonic' },
  { degree: 2,  roman: 'ii',   formulaSymbol: 'm',   function: 'predominant' },
  { degree: 4,  roman: 'iii',  formulaSymbol: 'm',   function: 'tonic' },
  { degree: 5,  roman: 'IV',   formulaSymbol: '',    function: 'subdominant' },
  { degree: 7,  roman: 'V',    formulaSymbol: '',    function: 'dominant' },
  { degree: 9,  roman: 'vi',   formulaSymbol: 'm',   function: 'tonic' },
  { degree: 11, roman: 'vii°', formulaSymbol: 'dim', function: 'dominant' },
];

const MINOR_DIATONIC: DiatonicChord[] = [
  { degree: 0,  roman: 'i',    formulaSymbol: 'm',   function: 'tonic' },
  { degree: 2,  roman: 'ii°',  formulaSymbol: 'dim', function: 'predominant' },
  { degree: 3,  roman: 'III',  formulaSymbol: '',    function: 'tonic' },
  { degree: 5,  roman: 'iv',   formulaSymbol: 'm',   function: 'subdominant' },
  { degree: 7,  roman: 'V',    formulaSymbol: '',    function: 'dominant' },  // harmonic minor raises 7th
  { degree: 8,  roman: 'VI',   formulaSymbol: '',    function: 'tonic' },
  { degree: 10, roman: 'VII',  formulaSymbol: '',    function: 'dominant' },
];

const FEEL_MAP: Record<string, string> = {
  'I→ii':   'gentle forward motion, slightly questioning',
  'I→IV':   'lifted, open, bluesy potential',
  'I→V':    'tense, wants to resolve back',
  'I→vi':   'melancholy, bittersweet — relative minor',
  'I→vii°': 'tense, leading — very unstable',
  'I→iii':  'smooth, mediant colour',
  'ii→V':   'jazz turnaround — expects resolution',
  'ii→IV':  'soft, earthy movement',
  'IV→I':   'resolved, classic cadence',
  'IV→V':   'building momentum, bright',
  'V→I':    'strongly resolved — authentic cadence',
  'V→vi':   'deceptive cadence — surprised resolution',
  'vi→IV':  'pop movement — emotional, relatable',
  'vi→ii':  'stepping down — introspective',
  'vi→V':   'building tension from relative minor',
  'i→iv':   'brooding, melancholy minor',
  'i→V':    'dramatic, classical tension',
  'i→VI':   'cinematic lift from minor',
  'i→VII':  'modal, unresolved — rock/folk feel',
  'iv→i':   'melancholy return',
  'V→i':    'minor authentic cadence',
  'VII→i':  'modal resolution',
};

// Map extended/altered chord symbols to their diatonic triad base for key matching.
// maj7/maj9/add9/6 → major; m7/m9/m6/madd9 → minor; dim7/m7b5 → dim; 7/9 → major (V context).
function diatonicBaseSymbol(symbol: string): string {
  if (['maj7', 'maj9', '6', 'add9'].includes(symbol)) return '';
  if (['m7', 'm9', 'm6', 'madd9', 'mM7'].includes(symbol)) return 'm';
  if (['dim7', 'm7b5'].includes(symbol)) return 'dim';
  if (['7', '9', '7sus4'].includes(symbol)) return '';
  return symbol;
}

function getFeel(fromRoman: string, toRoman: string): string {
  const key = `${fromRoman}→${toRoman}`;
  return FEEL_MAP[key] ?? 'harmonic movement';
}

// Given a chord interpretation, suggest what commonly follows
export function suggestProgressions(
  currentChord: ChordInterpretation | null
): ProgressionSuggestion[] {
  if (!currentChord) return [];

  const rootPc = currentChord.root.pitchClass;

  const suggestions: ProgressionSuggestion[] = [];
  const seen = new Set<string>();

  // Try to fit current chord into major and minor keys
  for (const keyQuality of ['major', 'minor'] as const) {
    const keyBuilder = keyQuality === 'major' ? buildMajorKey : buildMinorKey;
    const diatonicChords = keyQuality === 'major' ? MAJOR_DIATONIC : MINOR_DIATONIC;

    // Find which degree the current chord is in each key
    for (let keyRootPc = 0; keyRootPc < 12; keyRootPc++) {
      const key = keyBuilder(keyRootPc as PitchClass);
      const baseSymbol = diatonicBaseSymbol(currentChord.formula.symbol);
      const chordDegreeEntry = diatonicChords.find((d) => {
        const chordRoot = addSemitones(keyRootPc as PitchClass, d.degree);
        return chordRoot === rootPc && d.formulaSymbol === baseSymbol;
      });

      if (!chordDegreeEntry) continue;

      // Found a key context — suggest natural progressions from this degree
      const progressionTargets = getProgressionTargets(chordDegreeEntry.roman, keyQuality);

      for (const target of progressionTargets) {
        const targetDiatonic = diatonicChords.find((d) => d.roman === target);
        if (!targetDiatonic) continue;

        const targetRootPc = addSemitones(keyRootPc as PitchClass, targetDiatonic.degree);
        const targetFormula = CHORD_FORMULAS.find((f) => f.symbol === targetDiatonic.formulaSymbol);
        if (!targetFormula) continue;

        const pref = keyAccidentalPref(targetRootPc, keyQuality === 'major' ? 'major' : 'minor');
        const targetRoot: NoteSpelling = spellNote(targetRootPc, pref);
        const chordName = targetRoot.name + targetFormula.symbol;

        const key_id = `${chordName}`;
        if (seen.has(key_id)) continue;
        seen.add(key_id);

        suggestions.push({
          chord: chordName,
          root: targetRoot,
          formula: targetFormula,
          feel: getFeel(chordDegreeEntry.roman, target),
          function: targetDiatonic.function,
          reasoning: `${target} in ${key.root.name} ${keyQuality}`,
          romanNumeral: target,
        });
      }
    }
  }

  return suggestions.slice(0, 8);
}

function getProgressionTargets(fromRoman: string, keyQuality: 'major' | 'minor'): string[] {
  if (keyQuality === 'major') {
    const targets: Record<string, string[]> = {
      'I':    ['IV', 'V', 'vi', 'ii', 'iii'],
      'ii':   ['V', 'IV', 'I'],
      'iii':  ['vi', 'IV', 'I'],
      'IV':   ['V', 'I', 'ii', 'vi'],
      'V':    ['I', 'vi', 'IV'],
      'vi':   ['IV', 'ii', 'V', 'I'],
      'vii°': ['I'],
    };
    return targets[fromRoman] ?? [];
  } else {
    const targets: Record<string, string[]> = {
      'i':    ['iv', 'V', 'VI', 'VII'],
      'ii°':  ['V', 'i'],
      'III':  ['VI', 'VII', 'i'],
      'iv':   ['V', 'i', 'VII'],
      'V':    ['i', 'VI'],
      'VI':   ['III', 'VII', 'i'],
      'VII':  ['i', 'III'],
    };
    return targets[fromRoman] ?? [];
  }
}
