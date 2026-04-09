import React, { useEffect } from 'react';
import type { Voicing } from '../../types';

interface VoicingPickerProps {
  voicings: Voicing[];
  activeVoicing: Voicing | null;
  onSelect: (v: Voicing) => void;
}

export const VoicingPicker: React.FC<VoicingPickerProps> = ({ voicings, activeVoicing, onSelect }) => {
  // Auto-select the first voicing when the chord changes and none is active
  useEffect(() => {
    if (voicings.length > 0 && activeVoicing === null) {
      onSelect(voicings[0]);
    }
  }, [voicings, activeVoicing, onSelect]);

  if (voicings.length === 0) return null;

  return (
    <div className="control-section">
      <h3>Voicings</h3>
      <div className="voicing-list">
        {voicings.map((v, i) => (
          <button
            key={i}
            className={`voicing-btn${activeVoicing === v ? ' active' : ''}`}
            onClick={() => onSelect(v)}
          >
            <span className="voicing-label">{v.label}</span>
            <span className="voicing-meta">{v.fretSpan} fret span · {v.positions.length} strings</span>
          </button>
        ))}
      </div>
    </div>
  );
};
