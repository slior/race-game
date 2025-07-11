/**
 * @fileoverview Unit tests for the state serialization and deserialization module.
 * This file verifies that the encoding/decoding functions work correctly,
 * handle edge cases, and are robust against invalid input.
 */

import { encodeState, decodeState } from './storage';
import type { GameState } from '../types';

describe('State Storage', () => {
  // A sample, valid GameState object to be used across multiple tests.
  const mockGameState: GameState = {
    deck: [{ id: 'c1', type: 'Progress', name: 'Go', value: 50 }],
    discard: [],
    players: [
      {
        hand: [{ id: 'c2', type: 'Remedy', name: 'Green Light' }],
        inPlay: { progress: [], blocks: [], immunities: [] },
        totalKm: 0,
      },
    ],
    turnIndex: 0,
  };

  /**
   * Test case for successful round-trip encoding and decoding.
   * It verifies that a state object can be encoded and then decoded
   * back to its original form without any data loss.
   */
  it('should correctly encode and decode a game state object', () => {
    const encoded = encodeState(mockGameState);
    const decoded = decodeState(encoded);

    // The decoded object should not be null.
    expect(decoded).not.toBeNull();
    // The decoded object should be deeply equal to the original.
    expect(decoded).toEqual(mockGameState);
  });

  /**
   * Test case for handling invalid input.
   * It ensures that the decode function returns null when given a
   * string that is not a valid encoded state.
   */
  it('should return null when decoding an invalid string', () => {
    const invalidString = 'this-is-not-a-valid-encoded-state';
    expect(decodeState(invalidString)).toBeNull();
  });

  /**
   * Test case for handling an empty string.
   * The decode function should gracefully handle empty input
   * and return null.
   */
  it('should return null when decoding an empty string', () => {
    expect(decodeState('')).toBeNull();
  });

  /**
   * Test case to ensure URL-safe characters are handled correctly.
   * This test uses a state object that is known to produce '+' and '/'
   * characters when Base64 encoded, and verifies that the URL-safe
   * replacement and reversion works correctly.
   */
  it('should handle URL-safe characters correctly during round-trip', () => {
    // A state object with specific data that is likely to produce '+' and '/'
    // characters in its Base64 representation. The exact values here were
    // found through trial and error to produce the desired characters in the
    // test environment's btoa implementation.
    const stateWithSpecialChars: GameState = {
      deck: [],
      discard: [],
      players: [],
      turnIndex: 1,
      ...({ debug_info: 'úûüýþÿ' } as any),
    };

    const encoded = encodeState(stateWithSpecialChars);
    
    // The encoded string must not contain the original unsafe characters.
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');

    const decoded = decodeState(encoded);
    // The round-trip object must be identical to the original.
    expect(decoded).toEqual(stateWithSpecialChars);
    
    // To be certain the test is valid, we confirm that the *original*
    // base64 string (before our replacement) did contain the unsafe characters.
    const originalBase64 = btoa(JSON.stringify(stateWithSpecialChars));
    expect(originalBase64).toMatch(/(\+|\/)/);
  });
}); 