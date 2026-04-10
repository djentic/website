import React from 'react';
import type { ProgressionSuggestion, PitchClass } from '../../types';
import { chordPitchClasses } from '../../lib/music/chords';

interface ProgressionSuggestionsProps {
  suggestions: ProgressionSuggestion[];
  onChordClick: (pcs: PitchClass[], rootPc: PitchClass) => void;
  onAddFretboard: (suggestion: ProgressionSuggestion) => void;
  secondaryChordName: string | null;
}

const FUNCTION_COLORS: Record<string, string> = {
  tonic: 'func-tonic',
  predominant: 'func-predominant',
  subdominant: 'func-subdominant',
  dominant: 'func-dominant',
};

export const ProgressionSuggestions: React.FC<ProgressionSuggestionsProps> = ({
  suggestions,
  onChordClick,
  onAddFretboard,
  secondaryChordName,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="results-section">
      <h4>Progression Suggestions</h4>
      <div className="progression-list">
        {suggestions.map((s, i) => {
          const pcs = chordPitchClasses(s.root.pitchClass, s.formula.intervals) as PitchClass[];
          const isSecondary = secondaryChordName === s.chord;
          return (
            <div
              key={i}
              className="progression-item"
              onClick={() => onChordClick(pcs, s.root.pitchClass)}
              title={s.reasoning}
            >
              <div className="prog-top">
                <span className="prog-chord">{s.chord}</span>
                <span className="prog-roman">{s.romanNumeral}</span>
                <span className={`prog-func ${FUNCTION_COLORS[s.function] ?? ''}`}>
                  {s.function}
                </span>
                <button
                  className={`prog-add-btn${isSecondary ? ' active' : ''}`}
                  title={isSecondary ? 'Close second fretboard' : 'Open on second fretboard'}
                  onClick={(e) => { e.stopPropagation(); onAddFretboard(s); }}
                >
                  {isSecondary ? '✕' : '+'}
                </button>
              </div>
              <div className="prog-feel">{s.feel}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
