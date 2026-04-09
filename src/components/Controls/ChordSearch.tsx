import React, { useState, useMemo } from 'react';
import type { PitchClass, KeyInfo } from '../../types';
import { parseChordName, chordPitchClasses } from '../../lib/music/chords';
import { diatonicChords, isChordDiatonic } from '../../lib/music/scales';

interface ChordSearchProps {
  activeKey: KeyInfo | null;
  onChordSelect: (pcs: PitchClass[] | null, rootPc: PitchClass | null) => void;
}

const CHORD_OPTIONS = [
  'C', 'Cm', 'C7', 'Cmaj7', 'Cm7',
  'D', 'Dm', 'D7', 'Dmaj7', 'Dm7',
  'E', 'Em', 'E7', 'Emaj7', 'Em7',
  'F', 'Fm', 'F7', 'Fmaj7', 'Fm7',
  'G', 'Gm', 'G7', 'Gmaj7', 'Gm7',
  'A', 'Am', 'A7', 'Amaj7', 'Am7',
  'B', 'Bm', 'B7', 'Bmaj7', 'Bm7',
];

export const ChordSearch: React.FC<ChordSearchProps> = ({ activeKey, onChordSelect }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  function apply(value: string) {
    setError('');
    const parsed = parseChordName(value.trim());
    if (!parsed) {
      setError(`Unknown chord: "${value}"`);
      return;
    }
    const pcs = chordPitchClasses(parsed.rootPc, parsed.formula.intervals) as PitchClass[];
    onChordSelect(pcs, parsed.rootPc);
  }

  // Precompute which quick-list chips are diatonic to the active key
  const diatonicChipSet = useMemo(() => {
    if (!activeKey) return new Set<string>();
    const set = new Set<string>();
    for (const c of CHORD_OPTIONS) {
      const parsed = parseChordName(c);
      if (!parsed) continue;
      const pcs = chordPitchClasses(parsed.rootPc, parsed.formula.intervals) as PitchClass[];
      if (isChordDiatonic(pcs, activeKey)) set.add(c);
    }
    return set;
  }, [activeKey]);

  // Diatonic chords derived from the active key
  const keyChords = useMemo(() => activeKey ? diatonicChords(activeKey) : [], [activeKey]);

  return (
    <div className="control-section">
      <h3>Chord Lookup</h3>
      <div className="control-row">
        <input
          className="chord-input"
          placeholder='e.g. Am, F#7, Cmaj7'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && apply(input)}
        />
        <button className="btn-primary" onClick={() => apply(input)}>Show</button>
      </div>
      {error && <p className="error-msg">{error}</p>}

      {activeKey && keyChords.length > 0 && (
        <div className="key-chord-section">
          <span className="key-chord-label">
            Overlay chord on {activeKey.root.name} {activeKey.formula.name}
          </span>
          <div className="chord-quick-list">
            {keyChords.map((c) => (
              <button
                key={c.name}
                className="chip diatonic"
                onClick={() => {
                  setInput(c.name);
                  const pcs = chordPitchClasses(c.rootPc, c.formula.intervals) as PitchClass[];
                  onChordSelect(pcs, c.rootPc);
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chord-quick-list">
        {CHORD_OPTIONS.map((c) => (
          <button
            key={c}
            className={`chip${diatonicChipSet.has(c) ? ' diatonic' : ''}`}
            onClick={() => { setInput(c); apply(c); }}
          >
            {c}
          </button>
        ))}
      </div>

      <button className="btn-ghost small" onClick={() => onChordSelect(null, null)}>
        Clear highlight
      </button>
    </div>
  );
};
