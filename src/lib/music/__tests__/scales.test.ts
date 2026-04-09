import { describe, it, expect } from 'vitest';
import { buildMajorKey, buildMinorKey } from '../scales';

describe('buildMajorKey', () => {
  it('C major contains correct pitch classes', () => {
    const key = buildMajorKey(0);
    expect(key.pitchClasses).toEqual([0, 2, 4, 5, 7, 9, 11]);
  });

  it('C major degree map correct', () => {
    const key = buildMajorKey(0);
    expect(key.degreeMap.get(0)).toBe(1);  // C = 1
    expect(key.degreeMap.get(7)).toBe(5);  // G = 5
    expect(key.degreeMap.get(11)).toBe(7); // B = 7
  });

  it('G major has F# (pc=6)', () => {
    const key = buildMajorKey(7); // G
    expect(key.pitchClasses).toContain(6); // F#
    expect(key.pitchClasses).not.toContain(5); // not F
  });

  it('F major has Bb (pc=10)', () => {
    const key = buildMajorKey(5); // F
    expect(key.pitchClasses).toContain(10); // Bb
  });
});

describe('buildMinorKey', () => {
  it('A minor contains correct pitch classes', () => {
    const key = buildMinorKey(9); // A
    expect(key.pitchClasses).toEqual([9, 11, 0, 2, 4, 5, 7]);
  });
});
