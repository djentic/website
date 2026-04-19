import React from 'react';
import type { TuningConfig, FretPosition, PitchClass, KeyInfo, FretNote, ScalePosition, Voicing } from '../../types';
import { generateFretboard, FRET_MARKERS, DOUBLE_MARKERS } from '../../lib/music/fretboard';
import { SYNESTHESIA_COLORS } from '../../lib/music/synesthesia';
import './Fretboard.css';

interface FretboardProps {
  tuning: TuningConfig;
  fretCount: number;
  selectedPositions: FretPosition[];
  activeVoicingPcs: PitchClass[] | null;
  activeVoicing: Voicing | null;
  activeKey: KeyInfo | null;
  activeScalePosition: ScalePosition | null;
  rootPc: PitchClass | null;
  synesthesia?: boolean;
  onToggle: (pos: FretPosition) => void;
}

// Build a conic-gradient CSS string for N equal slices
function conicGradient(colors: string[]): string {
  const step = 360 / colors.length;
  return `conic-gradient(${colors
    .map((c, i) => `${c} ${i * step}deg ${(i + 1) * step}deg`)
    .join(', ')})`;
}

function noteRole(
  note: FretNote,
  isSelected: boolean,
  activeVoicingPcs: PitchClass[] | null,
  activeVoicing: Voicing | null,
  activeKey: KeyInfo | null,
  activeScalePosition: ScalePosition | null,
  rootPc: PitchClass | null
): { role: string; label: string; colors: string[] } {
  // If a position filter is active, suppress key highlighting outside its fret range
  // (selected notes and chord overlays are unaffected by the position filter)
  const outsidePosition =
    activeScalePosition !== null &&
    (note.position.fret < activeScalePosition.minFret ||
     note.position.fret > activeScalePosition.maxFret);
  const inChord = activeVoicing
    ? activeVoicing.positions.some(
        (p) => p.stringIndex === note.position.stringIndex && p.fret === note.position.fret
      )
    : activeVoicingPcs !== null && activeVoicingPcs.includes(note.pitchClass);
  const isChordRoot = inChord && rootPc === note.pitchClass;
  const scaleDegree = activeKey?.degreeMap.get(note.pitchClass);
  const inKey       = scaleDegree !== undefined && !outsidePosition;

  // No overlay at all — show note name dimly on every fret
  if (!isSelected && activeVoicingPcs === null && activeVoicing === null && activeKey === null) {
    return { role: 'none', label: note.noteName, colors: [] };
  }

  // Nothing to highlight on this fret
  if (!isSelected && !inChord && !inKey) {
    return { role: 'none', label: '', colors: [] };
  }

  // Determine CSS role class (controls box-shadow / fallback background)
  let role: string;
  let label: string;

  if (isSelected) {
    // Determine fill role from chord/key membership; selection itself is shown via outline
    if (isChordRoot) {
      role = 'root';
    } else if (inChord) {
      role = 'chord-tone';
    } else if (inKey) {
      role = scaleDegree === 1 ? 'root' : 'scale-degree';
    } else {
      role = 'selected';
    }
    label = note.noteName;
  } else if (isChordRoot) {
    role  = 'root';
    label = note.noteName;
  } else if (inChord) {
    role  = 'chord-tone';
    label = note.noteName;
  } else {
    // key only
    role  = scaleDegree === 1 ? 'root' : 'scale-degree';
    label = String(scaleDegree);
  }

  // Build color slices — every active membership gets a slice
  const colors: string[] = [];

  if (inChord)      colors.push('var(--color-chord-tone)'); // blue for all chord members
  if (isChordRoot)  colors.push('var(--color-root)');       // orange extra slice for root
  if (inKey) {
    const kc = scaleDegree === 1 ? 'var(--color-root)' : 'var(--color-scale-degree)';
    if (!colors.includes(kc)) colors.push(kc);              // avoid duplicate orange
  }

  // Fallback: single colour matches CSS class (shouldn't normally be needed)
  if (colors.length === 0) {
    colors.push(role.includes('root') ? 'var(--color-root)' : 'var(--color-scale-degree)');
  }

  return { role, label, colors };
}

export const Fretboard: React.FC<FretboardProps> = ({
  tuning,
  fretCount,
  selectedPositions,
  activeVoicingPcs,
  activeVoicing,
  activeKey,
  activeScalePosition,
  rootPc,
  synesthesia = false,
  onToggle,
}) => {
  const grid = generateFretboard(tuning, fretCount);
  const selectedSet = new Set(selectedPositions.map((p) => `${p.stringIndex}-${p.fret}`));

  // Strings stored low→high; display high→low (highest string at top)
  const displayStrings = [...tuning.strings].reverse();

  return (
    <div className="fretboard-wrapper">
      <div className="fretboard" style={{ '--fret-count': fretCount } as React.CSSProperties}>
        {/* Fret number header */}
        <div className="fret-header">
          <div className="string-label-spacer" />
          {Array.from({ length: fretCount + 1 }, (_, f) => (
            <div key={f} className="fret-number">{f === 0 ? '' : f}</div>
          ))}
        </div>

        {/* Strings */}
        {displayStrings.map((str) => {
          const notes = grid[str.stringIndex];
          return (
            <div key={str.stringIndex} className="string-row">
              <div className="string-label" title={str.displayName}>
                {str.displayName}
              </div>

              {notes.map((note) => {
                const key = `${note.position.stringIndex}-${note.position.fret}`;
                const isSelected = selectedSet.has(key);
                const { role, label, colors } = noteRole(note, isSelected, activeVoicingPcs, activeVoicing, activeKey, activeScalePosition, rootPc);
                const fret = note.position.fret;

                const synColor = synesthesia ? SYNESTHESIA_COLORS[note.pitchClass] : undefined;
                const synIndicator = synesthesia
                  ? role === 'root' ? 'syn-root'
                  : role === 'chord-tone' ? 'syn-chord'
                  : role === 'scale-degree' ? 'syn-scale'
                  : ''
                  : '';

                return (
                  <div
                    key={fret}
                    className={[
                      'fret-cell',
                      fret === 0 ? 'nut' : '',
                      FRET_MARKERS.includes(fret) ? 'marker' : '',
                      DOUBLE_MARKERS.includes(fret) ? 'double-marker' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => onToggle(note.position)}
                    title={`${note.noteName} — string ${str.stringIndex + 1}, fret ${fret}`}
                  >
                    {fret > 0 && <div className="string-line" />}
                    {synesthesia ? (
                      <div
                        className={['note-dot', 'synesthesia', synIndicator, isSelected ? 'user-selected' : ''].filter(Boolean).join(' ')}
                        style={{ background: synColor, color: 'var(--color-bg)' }}
                      >
                        <span>{note.noteName}</span>
                      </div>
                    ) : role !== 'none' ? (
                      <div
                        className={`note-dot ${role}${isSelected ? ' user-selected' : ''}`}
                        style={colors.length > 1 ? {
                          background: conicGradient(colors),
                          color: 'var(--color-bg)',
                        } : undefined}
                      >
                        <span>{label}</span>
                      </div>
                    ) : (
                      <div className="note-dot empty" />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Position marker dots */}
        <div className="fret-dot-row">
          <div className="string-label-spacer" />
          {Array.from({ length: fretCount + 1 }, (_, f) => (
            <div key={f} className="fret-pos-marker">
              {DOUBLE_MARKERS.includes(f) ? (
                <><span className="pos-dot" /><span className="pos-dot" /></>
              ) : FRET_MARKERS.includes(f) ? (
                <span className="pos-dot" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
