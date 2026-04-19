import React from 'react';

interface LegendProps {
  synesthesia?: boolean;
}

export const Legend: React.FC<LegendProps> = ({ synesthesia = false }) => (
  <div className="legend">
    {!synesthesia && (
      <>
        <span className="legend-item">
          <span className="legend-dot root" /> Root
        </span>
        <span className="legend-item">
          <span className="legend-dot chord-tone" /> Chord tone
        </span>
        <span className="legend-item">
          <span className="legend-dot scale-degree" /> Scale degree
        </span>
      </>
    )}
    <span className="legend-item">
      <span className="legend-dot selected" /> Selected
    </span>
  </div>
);
