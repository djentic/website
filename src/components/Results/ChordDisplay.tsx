import React from 'react';
import type { ChordResult } from '../../types';

interface ChordDisplayProps {
  result: ChordResult | null;
  onSelectInterpretation?: (index: number) => void;
}

const QUALITY_LABELS: Record<string, string> = {
  major: 'Major',
  minor: 'Minor',
  diminished: 'Diminished',
  augmented: 'Augmented',
  suspended: 'Suspended',
  power: 'Power',
  dominant: 'Dominant',
  extended: 'Extended',
  added: 'Added tone',
};

export const ChordDisplay: React.FC<ChordDisplayProps> = ({ result }) => {
  if (!result || result.interpretations.length === 0) {
    return (
      <div className="results-section empty">
        <p className="hint">Select 2+ notes on the fretboard to detect chords.</p>
      </div>
    );
  }

  const top = result.interpretations[0];
  const others = result.interpretations.slice(1);

  return (
    <div className="results-section">
      <div className="chord-primary">
        <span className="chord-name">{top.name}</span>
        <span className="chord-quality">{QUALITY_LABELS[top.formula.quality] ?? top.formula.quality}</span>
      </div>

      <div className="chord-intervals">
        {top.intervals.map((label, i) => (
          <span key={i} className="interval-chip">{label}</span>
        ))}
      </div>

      {others.length > 0 && (
        <div className="chord-alternatives">
          <span className="alt-label">Also: </span>
          {others.map((interp, i) => (
            <span key={i} className="alt-chip">{interp.name}</span>
          ))}
        </div>
      )}
    </div>
  );
};
