import React, { useState } from 'react';
import { Fretboard } from './Fretboard/Fretboard';
import { TuningControl } from './Controls/TuningControl';
import { ChordSearch } from './Controls/ChordSearch';
import { VoicingPicker } from './Controls/VoicingPicker';
import { KeySelector } from './Controls/KeySelector';
import { PositionFilter } from './Controls/PositionFilter';
import { ChordDisplay } from './Results/ChordDisplay';
import { ProgressionSuggestions } from './Results/ProgressionSuggestions';
import { KeyCompatibility } from './Results/KeyCompatibility';
import { Legend } from './Legend';
import { useAppState } from '../hooks/useAppState';
import type { PitchClass, ProgressionSuggestion } from '../types';
import { chordPitchClasses } from '../lib/music/chords';
import './App.css';

export const App: React.FC = () => {
  const state = useAppState();
  const [activeTab, setActiveTab] = useState<'tune' | 'chord' | 'key'>('tune');

  function handleProgressionClick(pcs: PitchClass[], _rootPc: PitchClass) {
    state.setActiveVoicingPcs(pcs);
  }

  function handleAddFretboard(s: ProgressionSuggestion) {
    if (state.secondaryChord?.name === s.chord) {
      state.setSecondaryChord(null);
    } else {
      state.setSecondaryChord({
        name: s.chord,
        pcs: chordPitchClasses(s.root.pitchClass, s.formula.intervals) as PitchClass[],
        rootPc: s.root.pitchClass,
        formula: s.formula,
      });
    }
  }

  const topChordPcs = state.topChord
    ? (chordPitchClasses(state.topChord.root.pitchClass, state.topChord.formula.intervals) as PitchClass[])
    : null;

  // Root PC for fretboard highlighting — prefer the explicitly selected chord root
  const rootPc: PitchClass | null =
    state.activeChordRootPc ??
    (state.activeVoicingPcs !== null && state.topChord
      ? state.topChord.root.pitchClass
      : state.activeVoicingPcs !== null
      ? state.activeVoicingPcs[0] ?? null
      : state.topChord?.root.pitchClass ?? null);

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
        <div className="main-column">
        <section className="fretboard-section">
          <Fretboard
            tuning={state.tuning}
            fretCount={state.fretCount}
            selectedPositions={state.selectedPositions}
            activeVoicingPcs={state.activeVoicingPcs}
            activeVoicing={state.activeVoicing}
            activeKey={state.activeKey}
            activeScalePosition={state.activeScalePosition}
            rootPc={rootPc}
            onToggle={state.togglePosition}
          />
        </section>

        {state.secondaryChord && (
          <section className="fretboard-section secondary-fretboard">
            <div className="secondary-fretboard-header">
              <span className="secondary-fretboard-title">{state.secondaryChord.name}</span>
              <VoicingPicker
                voicings={state.secondaryVoicings}
                activeVoicing={state.secondaryVoicing}
                onSelect={state.setSecondaryVoicing}
              />
              <button
                className="btn-ghost small secondary-fretboard-close"
                onClick={() => state.setSecondaryChord(null)}
              >✕ Close</button>
            </div>
            <Fretboard
              tuning={state.tuning}
              fretCount={state.fretCount}
              selectedPositions={[]}
              activeVoicingPcs={state.secondaryChord.pcs}
              activeVoicing={state.secondaryVoicing}
              activeKey={null}
              activeScalePosition={null}
              rootPc={state.secondaryChord.rootPc}
              onToggle={() => {}}
            />
          </section>
        )}

        <div className="results-strip">
          <ChordDisplay result={state.chordResult} />
          {state.chordResult && state.chordResult.interpretations.length > 0 && topChordPcs && (
            <KeyCompatibility
              chordPcs={topChordPcs}
              activeKey={state.activeKey}
              onKeyToggle={state.setKey}
              onKeyClear={() => { state.setActiveKey(null); state.setActiveScalePosition(null); }}
            />
          )}
          <ProgressionSuggestions
            suggestions={state.progressionSuggestions}
            onChordClick={handleProgressionClick}
            onAddFretboard={handleAddFretboard}
            secondaryChordName={state.secondaryChord?.name ?? null}
          />
        </div>
        </div>{/* end .main-column */}

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
            <>
              <ChordSearch
                activeKey={state.activeKey}
                onChordSelect={(pcs, rootPc, formula) => {
                  state.setActiveChord(pcs, rootPc, formula);
                }}
              />
              <VoicingPicker
                voicings={state.voicings}
                activeVoicing={state.activeVoicing}
                onSelect={state.setActiveVoicing}
              />
            </>
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

        </aside>
      </main>
      <footer className="app-footer">
        Feedback &amp; bugs: <a href="mailto:contact@adjentic.co.uk">contact@adjentic.co.uk</a>
      </footer>
    </div>
  );
};
