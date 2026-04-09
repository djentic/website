import React from 'react';
import type { TuningConfig, StringCount, PitchClass } from '../../types';
import { getPresetsForStringCount } from '../../data/tunings';
import { SHARP_NAMES } from '../../lib/music/notes';

interface TuningControlProps {
  stringCount: StringCount;
  tuning: TuningConfig;
  fretCount: number;
  onStringCountChange: (n: StringCount) => void;
  onTuningChange: (t: TuningConfig) => void;
  onFretCountChange: (n: number) => void;
}

export const TuningControl: React.FC<TuningControlProps> = ({
  stringCount,
  tuning,
  fretCount,
  onStringCountChange,
  onTuningChange,
  onFretCountChange,
}) => {
  const presets = getPresetsForStringCount(stringCount);

  function handlePresetChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const preset = presets.find((p) => p.name === e.target.value);
    if (preset) onTuningChange(preset);
  }

  function handleStringNoteChange(stringIndex: number, noteName: string) {
    const pc = SHARP_NAMES.indexOf(noteName);
    if (pc === -1) return;
    const newTuning: TuningConfig = {
      ...tuning,
      name: 'Custom',
      strings: tuning.strings.map((s) =>
        s.stringIndex === stringIndex
          ? { ...s, pitchClass: pc as PitchClass, displayName: noteName }
          : s
      ),
    };
    onTuningChange(newTuning);
  }

  // Display strings high→low for the control as well
  const displayStrings = [...tuning.strings].reverse();

  return (
    <div className="control-section">
      <h3>Tuning</h3>

      <div className="control-row">
        <label>Strings</label>
        <div className="button-group">
          {([6, 7, 8] as StringCount[]).map((n) => (
            <button
              key={n}
              className={stringCount === n ? 'active' : ''}
              onClick={() => onStringCountChange(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="control-row">
        <label>Preset</label>
        <select value={tuning.name} onChange={handlePresetChange}>
          {presets.map((p) => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
          {!presets.find((p) => p.name === tuning.name) && (
            <option value="Custom">Custom</option>
          )}
        </select>
      </div>

      <div className="tuning-strings">
        {displayStrings.map((str) => (
          <div key={str.stringIndex} className="tuning-string-row">
            <span className="string-num">str {str.stringIndex + 1}</span>
            <select
              value={str.pitchClass < SHARP_NAMES.length ? SHARP_NAMES[str.pitchClass] : 'C'}
              onChange={(e) => handleStringNoteChange(str.stringIndex, e.target.value)}
            >
              {SHARP_NAMES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="control-row">
        <label>Frets: {fretCount}</label>
        <input
          type="range"
          min={12}
          max={24}
          value={fretCount}
          onChange={(e) => onFretCountChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};
