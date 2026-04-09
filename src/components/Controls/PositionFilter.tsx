import React from 'react';
import type { ScalePosition } from '../../types';

interface PositionFilterProps {
  positions: ScalePosition[];
  active: ScalePosition | null;
  onChange: (pos: ScalePosition | null) => void;
}

export const PositionFilter: React.FC<PositionFilterProps> = ({ positions, active, onChange }) => {
  if (positions.length === 0) return null;

  return (
    <div className="control-section">
      <h3>Position</h3>
      <div className="position-filter-row">
        <button
          className={`pos-btn${active === null ? ' active' : ''}`}
          onClick={() => onChange(null)}
        >
          All
        </button>
        {positions.map((pos) => (
          <button
            key={pos.index}
            className={`pos-btn${active?.index === pos.index ? ' active' : ''}`}
            onClick={() => onChange(active?.index === pos.index ? null : pos)}
            title={`Frets ${pos.minFret}–${pos.maxFret}`}
          >
            {pos.label}
          </button>
        ))}
      </div>
      {active && (
        <p className="pos-fret-range">Frets {active.minFret}–{active.maxFret}</p>
      )}
    </div>
  );
};
