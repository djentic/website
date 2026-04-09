import React from 'react';

export const Legend: React.FC = () => (
  <div className="legend">
    <span className="legend-item">
      <span className="legend-dot root" /> Root
    </span>
    <span className="legend-item">
      <span className="legend-dot selected" /> Selected
    </span>
    <span className="legend-item">
      <span className="legend-dot chord-tone" /> Chord tone
    </span>
    <span className="legend-item">
      <span className="legend-dot scale-degree" /> Scale degree
    </span>
  </div>
);
