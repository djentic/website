import { describe, it, expect } from 'vitest';
import { detectChords, parseChordName } from '../chords';
import type { PitchClass } from '../../../types';

describe('detectChords', () => {
  it('detects C major from C E G', () => {
    const result = detectChords([0, 4, 7] as PitchClass[]);
    expect(result.interpretations.length).toBeGreaterThan(0);
    const top = result.interpretations[0];
    expect(top.root.pitchClass).toBe(0);
    expect(top.formula.symbol).toBe('');
    expect(top.name).toBe('C');
  });

  it('detects Am from A C E', () => {
    const result = detectChords([9, 0, 4] as PitchClass[]);
    const top = result.interpretations[0];
    expect(top.root.pitchClass).toBe(9);
    expect(top.formula.symbol).toBe('m');
    expect(top.name).toBe('Am');
  });

  it('detects G7 from G B D F', () => {
    const result = detectChords([7, 11, 2, 5] as PitchClass[]);
    const g7 = result.interpretations.find(
      (i) => i.root.pitchClass === 7 && i.formula.symbol === '7'
    );
    expect(g7).toBeDefined();
  });

  it('detects Bdim from B D F', () => {
    const result = detectChords([11, 2, 5] as PitchClass[]);
    const dim = result.interpretations.find(
      (i) => i.root.pitchClass === 11 && i.formula.symbol === 'dim'
    );
    expect(dim).toBeDefined();
  });

  it('returns empty for no notes', () => {
    const result = detectChords([]);
    expect(result.interpretations).toHaveLength(0);
  });
});

describe('parseChordName', () => {
  it('parses C major', () => {
    const r = parseChordName('C');
    expect(r?.rootPc).toBe(0);
    expect(r?.formula.symbol).toBe('');
  });

  it('parses Am', () => {
    const r = parseChordName('Am');
    expect(r?.rootPc).toBe(9);
    expect(r?.formula.symbol).toBe('m');
  });

  it('parses F#7', () => {
    const r = parseChordName('F#7');
    expect(r?.rootPc).toBe(6);
    expect(r?.formula.symbol).toBe('7');
  });

  it('returns null for invalid', () => {
    expect(parseChordName('X')).toBeNull();
  });
});
