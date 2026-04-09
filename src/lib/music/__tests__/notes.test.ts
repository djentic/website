import { describe, it, expect } from 'vitest';
import { pitchClassToName, addSemitones, semitoneDistance, spellNote } from '../notes';

describe('notes', () => {
  it('names pitch classes correctly with sharps', () => {
    expect(pitchClassToName(0)).toBe('C');
    expect(pitchClassToName(1)).toBe('C#');
    expect(pitchClassToName(11)).toBe('B');
  });

  it('names pitch classes correctly with flats', () => {
    expect(pitchClassToName(1, 'flat')).toBe('Db');
    expect(pitchClassToName(10, 'flat')).toBe('Bb');
  });

  it('adds semitones with wrapping', () => {
    expect(addSemitones(11, 1)).toBe(0); // B + 1 = C
    expect(addSemitones(7, 5)).toBe(0);  // G + P4 = C
  });

  it('computes semitone distance', () => {
    expect(semitoneDistance(0, 7)).toBe(7);  // C to G = P5
    expect(semitoneDistance(7, 0)).toBe(5);  // G to C = P4
    expect(semitoneDistance(0, 0)).toBe(0);
  });

  it('spells note correctly', () => {
    const n = spellNote(4, 'sharp');
    expect(n.name).toBe('E');
    expect(n.pitchClass).toBe(4);
  });
});
