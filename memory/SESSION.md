---
last_updated: 2026-09-05 19:45
status: active
---

# Session — theory-visualiser

## Current Focus

Left-handed fretboard mode — implemented, awaiting visual confirmation from user.

## Exact Stop Point

Code complete. tsc clean, 23/23 vitest pass. Vite dev server was left running on :5173.
No browser automation available this session (Chrome extension declined), so the mirror
has not been visually verified.

## What Was Just Done

- Added `leftHanded` prop to `Fretboard.tsx` -> `.fretboard.lefty` class
- Added `.lefty` CSS block (row-reverse + nut border / fret wire / capo bar / string
  label side flips) at the end of `Fretboard.css`
- Header toggle button "Left-handed" in `App.tsx`, wired to both Fretboard instances

## Next Action

User eyeballs http://localhost:5173 with the toggle on. Known risk: `.fretboard-scroll`
horizontal overflow under `row-reverse` at narrow widths — if the nut becomes unreachable,
fall back to `direction: rtl` on `.fretboard.lefty` with `direction: ltr` restored on
`.fret-number`, `.string-label` and `.note-dot`.
Pre-existing lint error (unrelated): `_rootPc` unused, App.tsx:26.

## Working Context

React/TypeScript/Vite guitar theory app. Features: fretboard, chord detection, chord lookup, key overlays, progression suggestions, tuning presets. GitHub Pages deploy via .github/workflows/. dist/ present. vitest unit tests for theory engine.

## Carry-over to Other Files

None.
