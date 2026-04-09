import React from 'react';
import type { PitchClass } from '../../types';
import { compatibleKeys } from '../../lib/music/scales';

interface KeyCompatibilityProps {
  chordPcs: PitchClass[];
}

export const KeyCompatibility: React.FC<KeyCompatibilityProps> = ({ chordPcs }) => {
  if (chordPcs.length === 0) return null;

  const compatible = compatibleKeys(chordPcs);
  const diatonic = compatible.filter((c) => c.diatonic);
  const borrowed = compatible.filter((c) => !c.diatonic);

  return (
    <div className="results-section">
      <h4>Compatible Keys</h4>
      {diatonic.length > 0 && (
        <div className="key-group">
          <span className="key-group-label diatonic">Diatonic</span>
          <div className="key-chips">
            {diatonic.map((c, i) => (
              <span key={i} className="key-chip diatonic">
                {c.key.root.name} {c.key.formula.quality === 'major' ? 'maj' : 'min'}
              </span>
            ))}
          </div>
        </div>
      )}
      {borrowed.length > 0 && (
        <div className="key-group">
          <span className="key-group-label borrowed">Borrowed / modal</span>
          <div className="key-chips">
            {borrowed.map((c, i) => (
              <span key={i} className="key-chip borrowed">
                {c.key.root.name} {c.key.formula.quality === 'major' ? 'maj' : 'min'}
                {c.borrowedTones > 0 && <em> ({c.borrowedTones} borrowed)</em>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
