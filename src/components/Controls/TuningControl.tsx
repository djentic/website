import React, { useState } from 'react';
import type { TuningConfig, StringCount, PitchClass, InstrumentType } from '../../types';
import { getPresetsForStringCount } from '../../data/tunings';
import { SHARP_NAMES } from '../../lib/music/notes';

const MAX_FRETS = 24;

interface TuningControlProps {
  stringCount: StringCount;
  tuning: TuningConfig;
  fretMin: number;
  fretMax: number;
  capoFret: number;
  onStringCountChange: (n: StringCount, instrument?: InstrumentType) => void;
  onTuningChange: (t: TuningConfig) => void;
  onFretRangeChange: (min: number, max: number) => void;
  onCapoChange: (n: number) => void;
}

const GUITAR_STRING_COUNTS: StringCount[] = [6, 7, 8];
const BASS_STRING_COUNTS: StringCount[] = [4, 5, 6];

export const TuningControl: React.FC<TuningControlProps> = ({
  stringCount,
  tuning,
  fretMin,
  fretMax,
  capoFret,
  onStringCountChange,
  onTuningChange,
  onFretRangeChange,
  onCapoChange,
}) => {
  const [instrument, setInstrument] = useState<InstrumentType>('guitar');

  const presets = getPresetsForStringCount(stringCount, instrument);

  function handleInstrumentChange(inst: InstrumentType) {
    setInstrument(inst);
    const defaultCount: StringCount = inst === 'bass' ? 4 : 6;
    onStringCountChange(defaultCount, inst);
  }

  function handleStringCountChange(n: StringCount) {
    onStringCountChange(n, instrument);
  }

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

  const stringCounts = instrument === 'bass' ? BASS_STRING_COUNTS : GUITAR_STRING_COUNTS;
  // Display strings high→low for the control as well
  const displayStrings = [...tuning.strings].reverse();

  return (
    <div className="control-section">
      <h3>Tuning</h3>

      <div className="control-row">
        <label>Instrument</label>
        <div className="button-group">
          {(['guitar', 'bass'] as InstrumentType[]).map((inst) => (
            <button
              key={inst}
              className={instrument === inst ? 'active' : ''}
              onClick={() => handleInstrumentChange(inst)}
            >
              {inst.charAt(0).toUpperCase() + inst.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="control-row">
        <label>Strings</label>
        <div className="button-group">
          {stringCounts.map((n) => (
            <button
              key={n}
              className={stringCount === n ? 'active' : ''}
              onClick={() => handleStringCountChange(n)}
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

      <div className="control-row fret-range-row">
        <label>Frets: {fretMin}–{fretMax}</label>
        <div className="dual-range">
          <div className="dual-range-track">
            <div
              className="dual-range-fill"
              style={{
                left: `${(fretMin / MAX_FRETS) * 100}%`,
                right: `${100 - (fretMax / MAX_FRETS) * 100}%`,
              }}
            />
          </div>
          <input
            type="range" min={0} max={MAX_FRETS}
            value={fretMin}
            onChange={(e) => onFretRangeChange(Math.min(Number(e.target.value), fretMax - 1), fretMax)}
            className="dual-range-input"
          />
          <input
            type="range" min={0} max={MAX_FRETS}
            value={fretMax}
            onChange={(e) => onFretRangeChange(fretMin, Math.max(Number(e.target.value), fretMin + 1))}
            className="dual-range-input"
          />
        </div>
      </div>

      <div className="control-row">
        <label>Capo</label>
        <select value={capoFret} onChange={(e) => onCapoChange(Number(e.target.value))}>
          <option value={0}>None</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((f) => (
            <option key={f} value={f}>Fret {f}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
