import React, { useState } from 'react';
import type { PitchClass, ScaleFormula } from '../../types';
import { SCALE_FORMULAS } from '../../data/scales';

interface KeySelectorProps {
  onKeySelect: (rootPc: PitchClass, formula: ScaleFormula) => void;
  onClear: () => void;
}

const NOTE_OPTIONS = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];

// Group scales for the dropdown
const SCALE_GROUPS = [
  {
    label: 'Diatonic',
    scales: ['Major (Ionian)', 'Natural Minor (Aeolian)', 'Harmonic Minor', 'Phrygian', 'Phrygian Dominant', 'Lydian', 'Mixolydian'],
  },
  {
    label: 'Pentatonic & Blues',
    scales: ['Major Pentatonic', 'Minor Pentatonic', 'Blues'],
  },
  {
    label: 'Symmetric',
    scales: ['Diminished (W-H)'],
  },
];

export const KeySelector: React.FC<KeySelectorProps> = ({ onKeySelect, onClear }) => {
  const [selectedPc, setSelectedPc] = useState<PitchClass>(0);
  const [selectedFormula, setSelectedFormula] = useState<ScaleFormula>(SCALE_FORMULAS[0]);

  function handleFormulaChange(name: string) {
    const f = SCALE_FORMULAS.find((s) => s.name === name);
    if (f) setSelectedFormula(f);
  }

  function handleApply() {
    onKeySelect(selectedPc, selectedFormula);
  }

  return (
    <div className="control-section">
      <h3>Scale Overlay</h3>
      <div className="control-row">
        <label>Root</label>
        <select
          value={selectedPc}
          onChange={(e) => setSelectedPc(Number(e.target.value) as PitchClass)}
        >
          {NOTE_OPTIONS.map((n, i) => (
            <option key={i} value={i}>{n}</option>
          ))}
        </select>
      </div>
      <div className="control-row">
        <label>Scale</label>
        <select
          value={selectedFormula.name}
          onChange={(e) => handleFormulaChange(e.target.value)}
        >
          {SCALE_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.scales.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="control-row">
        <button className="btn-primary" onClick={handleApply}>Show Scale</button>
        <button className="btn-ghost" onClick={onClear}>Clear</button>
      </div>
    </div>
  );
};
