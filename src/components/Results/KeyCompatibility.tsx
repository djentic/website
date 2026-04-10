import React from 'react';
import type { PitchClass, KeyInfo, ScaleFormula } from '../../types';
import { compatibleKeys } from '../../lib/music/scales';

interface KeyCompatibilityProps {
  chordPcs: PitchClass[];
  activeKey: KeyInfo | null;
  onKeyToggle: (rootPc: PitchClass, formula: ScaleFormula) => void;
  onKeyClear: () => void;
}

export const KeyCompatibility: React.FC<KeyCompatibilityProps> = ({
  chordPcs,
  activeKey,
  onKeyToggle,
  onKeyClear,
}) => {
  if (chordPcs.length === 0) return null;

  const compatible = compatibleKeys(chordPcs);
  const diatonic = compatible.filter((c) => c.diatonic);
  const borrowed = compatible.filter((c) => !c.diatonic);

  function isActive(key: KeyInfo) {
    return (
      activeKey !== null &&
      activeKey.root.pitchClass === key.root.pitchClass &&
      activeKey.formula.name === key.formula.name
    );
  }

  function handleClick(key: KeyInfo) {
    if (isActive(key)) {
      onKeyClear();
    } else {
      onKeyToggle(key.root.pitchClass, key.formula);
    }
  }

  return (
    <div className="results-section">
      <h4>Compatible Keys</h4>
      {diatonic.length > 0 && (
        <div className="key-group">
          <span className="key-group-label diatonic">Diatonic</span>
          <div className="key-chips">
            {diatonic.map((c, i) => (
              <button
                key={i}
                className={`key-chip diatonic${isActive(c.key) ? ' active' : ''}`}
                onClick={() => handleClick(c.key)}
                title="Click to overlay this key on the fretboard"
              >
                {c.key.root.name} {c.key.formula.quality === 'major' ? 'maj' : 'min'}
              </button>
            ))}
          </div>
        </div>
      )}
      {borrowed.length > 0 && (
        <div className="key-group">
          <span className="key-group-label borrowed">Borrowed / modal</span>
          <div className="key-chips">
            {borrowed.map((c, i) => (
              <button
                key={i}
                className={`key-chip borrowed${isActive(c.key) ? ' active' : ''}`}
                onClick={() => handleClick(c.key)}
                title="Click to overlay this key on the fretboard"
              >
                {c.key.root.name} {c.key.formula.quality === 'major' ? 'maj' : 'min'}
                {c.borrowedTones > 0 && <em> ({c.borrowedTones} borrowed)</em>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
