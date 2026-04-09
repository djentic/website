# CLAUDE.md

## Project goal
Build a local-first web app for guitarists that visualizes the fretboard, identifies chords from selected notes, shows chord shapes and intervals, supports alternate tunings and different string counts, and helps with chord progression and key relationships.

The app should be practical for learning, exploration, and composition rather than a generic music theory demo.

## Product requirements
Create a web app with these core capabilities:

### 1. Interactive fretboard visualization
- Render a guitar fretboard that supports:
  - 6-string guitars by default
  - optional 7-string guitars
  - optional 8-string guitars
- Allow the user to choose the number of frets shown.
- Label notes clearly on every fret.
- Make it easy to click or tap notes on the fretboard.
- Show octave relationships in a visually understandable way.
- Make the UI readable for someone who already knows basic theory and technique but needs fretboard visualization.

### 2. Chord detection from selected notes
- Let the user select any set of notes on the fretboard.
- Calculate and display:
  - the chord name
  - possible enharmonic interpretations where relevant
  - chord quality
  - intervals relative to the root
- Support at minimum:
  - major
  - minor
  - diminished
  - augmented
  - sus2
  - sus4
  - power chords
  - 6th chords
  - 7th chords
  - major 7th
  - minor 7th
  - dominant 7th
  - add9
  - 9th where reasonably derivable
- If multiple chord interpretations are possible, rank the most musically likely options first rather than showing random possibilities.
- Do not fake music theory. If detection is ambiguous, say so clearly.

### 3. Chord-to-fretboard highlighting
- Let the user choose a chord by name and have the app highlight fretboard positions that form that chord.
- Show useful voicing groups instead of merely highlighting every theoretical occurrence everywhere.
- Prefer playable clusters and recognizable guitar-friendly shapes.
- Include multiple voicing views where useful:
  - open-position voicings
  - movable shapes
  - compact triads
  - extended voicings when relevant
- Allow the user to filter or prioritize by:
  - string set
  - fret range
  - difficulty/playability

### 4. Chord progression suggestions
- When a chord is selected or detected, suggest chords that commonly progress from it.
- Explain the musical feel of each progression in plain language.
- Examples of explanation style:
  - resolved / stable
  - tense / wants to move
  - bright / uplifting
  - darker / melancholy
  - bluesy
  - jazzy
  - cinematic
  - modal / ambiguous
- Base suggestions on real harmonic relationships, not random recommendations.
- Support at least:
  - diatonic major key harmony
  - diatonic minor key harmony
  - common dominant movement
  - basic modal interchange suggestions where simple and helpful
- Show why a suggestion works:
  - shared key context
  - function like tonic, predominant, dominant
  - borrowed color
- Do not overcomplicate the first version with advanced jazz analysis unless the structure is ready for extension.

### 5. Tuning support
- Allow tuning to be set per string.
- The tuning system must support:
  - standard tuning
  - drop tunings
  - open tunings
  - arbitrary custom tunings
- When tuning changes, all note labels, chord shapes, interval overlays, and key overlays must update correctly.
- Treat tuning as a first-class part of the data model, not a cosmetic setting.

### 6. Key highlighting
- Allow the user to highlight a major key across the full fretboard.
- Allow the user to highlight a minor key across the full fretboard.
- Show scale degrees clearly.
- Distinguish root notes from other scale tones.
- Make it easy to see repeating patterns across the neck.

### 7. Key and chord overlay
- Allow the user to overlay a selected chord with compatible major and minor keys.
- Show which keys contain the chord naturally.
- Distinguish between:
  - strongly compatible / diatonic matches
  - plausible borrowed/modal relationships
  - weaker or more ambiguous matches
- Help the user understand the relationship between chord tones and scale tones.

## UX requirements
- The app should feel like a musician’s tool, not a toy.
- Prioritize fast interaction and instant visual feedback.
- Avoid clutter.
- Use color and labels carefully so the fretboard remains readable.
- Include a legend for:
  - roots
  - chord tones
  - extensions
  - scale degrees
  - currently selected notes
- Support mouse-first desktop usage well.
- Make the layout responsive enough to work on a tablet, but optimize primarily for desktop/laptop use.
- Add hover or click details for notes, intervals, and chord tones.
- Preserve user state where sensible during a session.

## Technical requirements
- Build this as a web app.
- Prefer a modern frontend stack that is easy to run locally.
- Good default choice:
  - React
  - TypeScript
  - Vite
- You may use a lightweight UI library if it helps, but avoid overengineering.
- Do not add unnecessary dependencies.
- Keep music theory logic separate from rendering logic.
- Create clear domain modules for:
  - note representation
  - intervals
  - tunings
  - fretboard generation
  - chord detection
  - chord voicing generation
  - key and scale generation
  - progression suggestion rules
- Favor pure functions for theory calculations.
- Write code that is extendable for future features like arpeggios, modes, left-handed display, and scale pattern practice.

## Architecture guidance
Use a structure similar to:

- `src/components/`
  - fretboard rendering
  - controls panel
  - chord result display
  - progression suggestions
  - legends and overlays
- `src/lib/music/`
  - notes.ts
  - intervals.ts
  - tunings.ts
  - fretboard.ts
  - chords.ts
  - voicings.ts
  - scales.ts
  - harmony.ts
- `src/types/`
  - shared domain types
- `src/data/`
  - preset tunings
  - chord formulas
  - scale formulas
- `src/hooks/`
  - state and selection logic if useful

Keep the music theory engine independent enough that it could later be tested or reused outside the UI.

## Data and theory rules
- Use twelve-tone pitch classes as the base representation.
- Maintain note spelling awareness where possible so chord names are not nonsensical.
- Handle enharmonic notes carefully.
- Separate pitch-class logic from displayed note names.
- Chord detection should work from unordered selected notes.
- Voicing generation should account for the instrument layout and current tuning.
- Key compatibility should be derived from actual chord-tone membership and harmonic function where possible.
- Progression suggestions should be deterministic and explainable.

## Implementation priorities
Build in this order:

1. Basic interactive fretboard with configurable tuning and string count
2. Accurate note mapping across the fretboard
3. User note selection and chord detection
4. Chord lookup and fretboard highlighting
5. Major/minor key overlays
6. Chord-to-key overlay logic
7. Progression suggestions with plain-language descriptions
8. UX polish and filtering of voicings/shapes

## Constraints
- Do not build a backend unless there is a clear need.
- Keep the first version local-first and simple to run.
- Do not add authentication, accounts, or cloud sync.
- Do not add unrelated gamification features.
- Do not overcomplicate with MIDI input or audio playback in the first version unless the core app is already complete.
- Do not invent unsupported theory claims.
- Prefer correctness and clarity over flashy visuals.

## Expected behavior from Claude Code
When working on this project:
- First inspect the repository and propose a concise implementation plan.
- Then implement the app in small, coherent steps.
- After each major milestone, verify the app still runs.
- Keep edits scoped to what is necessary.
- Explain tradeoffs briefly when theory handling is ambiguous.
- When adding theory logic, include tests for the core calculation functions.
- Prefer practical guitar-oriented results over overly academic output.

## Definition of done for MVP
The MVP is complete when:
- A user can choose 6, 7, or 8 strings.
- A user can set the tuning of each string manually.
- The fretboard updates correctly for the chosen tuning.
- A user can click notes on the fretboard and see likely chord names.
- A user can select a chord and see playable highlighted fretboard positions.
- A user can highlight major and minor keys across the neck.
- A user can overlay a chord with compatible major and minor keys.
- A user can see suggested next chords with a short explanation of the feel/function.
- The app runs locally with straightforward setup.

## Nice-to-have features after MVP
Only tackle these after the MVP is solid:
- Left-handed mode
- Arpeggio highlighting
- CAGED views
- Scale box visualization
- Mode overlays
- Chord inversion labeling
- Export/share current view
- Practice mode or quiz mode

## Output expectations
When implementing, produce:
- clean project structure
- concise README with local run instructions
- clear separation between UI code and theory code
- tests for core theory functions
- a polished but not bloated interface
