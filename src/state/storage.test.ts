/**
 * @file src/state/storage.test.ts
 *
 * This file contains unit tests for the game state serialization and
 * deserialization logic implemented in `storage.ts`.
 */

import { encodeState, decodeState } from './storage';
import type { GameState } from '../types';

describe('Storage', () => {
  describe('encodeState and decodeState', () => {
    // A sample, valid GameState object to be used across multiple tests.
    const mockGameState: GameState = {
      deck: [],
      discard: [],
      turnIndex: 0,
      players: [
        {
          id: 'player-0',
          hand: [{ id: 'c1', type: 'Remedy', name: 'Green Light' }],
          inPlay: { progress: [], blocks: [], immunities: [] },
          totalKm: 0,
          isReady: false,
          aiStrategy: null,
          isThinking: false,
          isTargeted: false,
        },
      ],
      actionState: null,
      events: [{ type: 'system', message: 'Game started' }],
    };

    /**
     * Test case for successful round-trip encoding and decoding.
     * It verifies that a state object can be encoded and then decoded
     * back to its original form without any data loss.
     */
    it('should correctly encode and decode a game state object', () => {
      const encoded = encodeState(mockGameState);
      const decoded = decodeState(encoded);

      expect(decoded).not.toBeNull();
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
      
      expect(encoded).not.toContain('+');
      expect(encoded).not.toContain('/');

      const decoded = decodeState(encoded);
      expect(decoded).toEqual(stateWithSpecialChars);
      
      const originalBase64 = btoa(JSON.stringify(stateWithSpecialChars));
      expect(originalBase64).toMatch(/(\+|\/)/);
    });
  });
}); 