import React, { useState } from 'react';
import { Fretboard } from './Fretboard/Fretboard';
import { TuningControl } from './Controls/TuningControl';
import { ChordSearch } from './Controls/ChordSearch';
import { KeySelector } from './Controls/KeySelector';
import { PositionFilter } from './Controls/PositionFilter';
import { ChordDisplay } from './Results/ChordDisplay';
import { ProgressionSuggestions } from './Results/ProgressionSuggestions';
import { KeyCompatibility } from './Results/KeyCompatibility';
import { Legend } from './Legend';
import { useAppState } from '../hooks/useAppState';
import type { PitchClass } from '../types';
import { chordPitchClasses } from '../lib/music/chords';
import './App.css';

export const App: React.FC = () => {
  const state = useAppState();
  const [activeTab, setActiveTab] = useState<'tune' | 'chord' | 'key'>('tune');

  function handleProgressionClick(pcs: PitchClass[], _rootPc: PitchClass) {
    state.setActiveVoicingPcs(pcs);
  }

  const topChordPcs = state.topChord
    ? (chordPitchClasses(state.topChord.root.pitchClass, state.topChord.formula.intervals) as PitchClass[])
    : null;

  // Root PC for fretboard highlighting
  const rootPc: PitchClass | null =
    state.activeVoicingPcs !== null && state.topChord
      ? state.topChord.root.pitchClass
      : state.activeVoicingPcs !== null
      ? state.activeVoicingPcs[0] ?? null
      : state.topChord?.root.pitchClass ?? null;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Theory Visualiser</h1>
        <Legend />
        <button className="btn-ghost small" onClick={state.clearSelection}>
          Clear selection
        </button>
      </header>

      <main className="app-body">
        <section className="fretboard-section">
          <Fretboard
            tuning={state.tuning}
            fretCount={state.fretCount}
            selectedPositions={state.selectedPositions}
            activeVoicingPcs={state.activeVoicingPcs}
            activeKey={state.activeKey}
            activeScalePosition={state.activeScalePosition}
            rootPc={rootPc}
            onToggle={state.togglePosition}
          />
        </section>

        <aside className="sidebar">
          <nav className="tab-nav">
            <button
              className={activeTab === 'tune' ? 'active' : ''}
              onClick={() => setActiveTab('tune')}
            >Tuning</button>
            <button
              className={activeTab === 'chord' ? 'active' : ''}
              onClick={() => setActiveTab('chord')}
            >Chords</button>
            <button
              className={activeTab === 'key' ? 'active' : ''}
              onClick={() => setActiveTab('key')}
            >Keys</button>
          </nav>

          {activeTab === 'tune' && (
            <TuningControl
              stringCount={state.stringCount}
              tuning={state.tuning}
              fretCount={state.fretCount}
              onStringCountChange={state.setStringCount}
              onTuningChange={state.setTuning}
              onFretCountChange={state.setFretCount}
            />
          )}

          {activeTab === 'chord' && (
            <ChordSearch
              activeKey={state.activeKey}
              onChordSelect={(pcs, _root) => {
                state.setActiveVoicingPcs(pcs);
              }}
            />
          )}

          {activeTab === 'key' && (
            <>
              <KeySelector
                onKeySelect={state.setKey}
                onClear={() => { state.setActiveKey(null); state.setActiveScalePosition(null); }}
              />
              <PositionFilter
                positions={state.scalePositions}
                active={state.activeScalePosition}
                onChange={state.setActiveScalePosition}
              />
            </>
          )}

          <div className="results-area">
            <ChordDisplay result={state.chordResult} />

            {state.chordResult && state.chordResult.interpretations.length > 0 && topChordPcs && (
              <KeyCompatibility chordPcs={topChordPcs} />
            )}

            <ProgressionSuggestions
              suggestions={state.progressionSuggestions}
              onChordClick={handleProgressionClick}
            />
          </div>
        </aside>
      </main>
    </div>
  );
};
