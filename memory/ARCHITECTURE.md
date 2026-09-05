---
last_updated: 2026-09-05
---

# Architecture — theory-visualiser

## Overview

Local-first guitar theory web app. React 19 + TypeScript + Vite. Interactive fretboard with chord detection, chord lookup, key overlays, progression suggestions, and configurable tunings. Hosted on GitHub Pages.

## Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | React 19 + TypeScript | Vite build |
| Testing | Vitest + Testing Library | Theory engine unit tests |
| Hosting | GitHub Pages | .github/workflows/ |

## Structure

```
theory-visualiser/
├── src/
│   ├── types/          — shared domain types
│   ├── data/           — chord formulas, scale formulas, tuning presets
│   ├── lib/music/      — pure theory functions
│   │   └── __tests__/  — unit tests for theory engine
│   └── hooks/          — app state
├── public/
│   └── icons.svg
└── vite.config.ts
```

## Features

- Interactive fretboard (6/7/8 strings, configurable frets)
- Chord detection from selected notes (quality, intervals, enharmonic alternatives)
- Chord lookup by name → highlight positions
- Major/minor key overlays with scale degrees
- Compatible key display for any detected chord
- Chord progression suggestions with plain-language feel descriptions
- Tuning presets + fully custom per-string tuning
- Left-handed display mode (mirrors fretboard only; `.fretboard.lefty` CSS, no theory impact)
