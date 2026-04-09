# Theory Visualiser

A local-first guitar theory web app for visualizing fretboards, detecting chords, and exploring harmony.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Features

- Interactive fretboard (6/7/8 strings, configurable frets)
- Click notes to detect chords with quality, intervals, and enharmonic alternatives
- Chord lookup — type a chord name to highlight positions on the neck
- Major/minor key overlays showing scale degrees
- Compatible key display for any detected chord
- Chord progression suggestions with plain-language feel descriptions
- Tuning presets (Standard, Drop D, DADGAD, Open G, Open E, 7-string, 8-string) + fully custom per-string tuning

## Development

```bash
npm run dev        # dev server
npm test           # run theory unit tests
npm run build      # production build
```

## Project structure

```
src/
  types/          — shared domain types
  data/           — chord formulas, scale formulas, tuning presets
  lib/music/      — pure theory functions (notes, intervals, chords, scales, harmony, voicings)
    __tests__/    — unit tests for theory engine
  hooks/          — app state
  components/     — UI (Fretboard, Controls, Results)
```
