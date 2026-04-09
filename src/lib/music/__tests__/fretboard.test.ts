import { describe, it, expect } from 'vitest';
import { generateFretboard } from '../fretboard';
import { STANDARD_6 } from '../../../data/tunings';

describe('generateFretboard', () => {
  it('generates correct pitch class at fret 0 (open strings)', () => {
    const grid = generateFretboard(STANDARD_6, 24);
    // String 0 (low E) open = E = pc 4
    expect(grid[0][0].pitchClass).toBe(4);
    // String 1 (A) open = A = pc 9
    expect(grid[1][0].pitchClass).toBe(9);
    // String 5 (high e) open = E = pc 4
    expect(grid[5][0].pitchClass).toBe(4);
  });

  it('computes fret 12 as same pitch class as open', () => {
    const grid = generateFretboard(STANDARD_6, 24);
    for (let s = 0; s < 6; s++) {
      expect(grid[s][12].pitchClass).toBe(grid[s][0].pitchClass);
    }
  });

  it('string 0 fret 5 = A (pc 9)', () => {
    const grid = generateFretboard(STANDARD_6, 24);
    expect(grid[0][5].pitchClass).toBe(9); // E+5=A
  });

  it('has correct note name', () => {
    const grid = generateFretboard(STANDARD_6, 24);
    expect(grid[0][0].noteName).toBe('E');
    expect(grid[1][0].noteName).toBe('A');
  });
});
