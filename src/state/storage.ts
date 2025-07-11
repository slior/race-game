/**
 * @fileoverview This file provides functions for serializing and deserializing
 * the game state to and from a URL-safe, Base64-encoded string. This allows
 * the entire game state to be persisted in the browser's URL.
 */

import type { GameState } from '../types';

/**
 * Encodes the game state into a URL-safe, Base64-encoded string.
 *
 * This function takes the complete game state object, converts it to a JSON
 * string, and then encodes it for safe transmission in a URL.
 *
 * @param {GameState} state The game state object to encode.
 * @returns {string} A URL-safe, Base64-encoded string representing the game state.
 */
export function encodeState(state: GameState): string {
  // Convert the state object to a JSON string.
  const jsonState = JSON.stringify(state);

  // Encode the JSON string into a standard Base64 string.
  // The btoa() function creates a Base64-encoded ASCII string from a string of binary data.
  const base64State = btoa(jsonState);

  // Make the Base64 string URL-safe by replacing '+' and '/' characters.
  // These characters have special meanings in URLs and can cause issues.
  return base64State.replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Decodes a URL-safe, Base64-encoded string back into a GameState object.
 *
 * This function takes an encoded string from a URL, reverses the encoding
 * process, and attempts to parse it back into a valid GameState object.
 * It is designed to fail gracefully by returning null if the input is
 * malformed, empty, or invalid in any way.
 *
 * @param {string} encodedState The URL-safe, Base64-encoded state string.
 * @returns {GameState | null} The decoded GameState object, or null if decoding fails.
 */
export function decodeState(encodedState: string): GameState | null {
  try {
    // Revert the URL-safe characters back to standard Base64.
    const base64State = encodedState.replace(/-/g, '+').replace(/_/g, '/');

    // Decode the Base64 string back to the original JSON string.
    // The atob() function decodes a string of data which has been encoded using Base64 encoding.
    const jsonState = atob(base64State);

    // Parse the JSON string back into a JavaScript object.
    const state = JSON.parse(jsonState);

    // Return the parsed state, assuming it matches the GameState interface.
    // No runtime validation is performed here, we trust the encoded source.
    return state as GameState;
  } catch (error) {
    // If any step in the process fails (e.g., invalid Base64, malformed JSON),
    // catch the error and return null to indicate failure.
    console.error('Failed to decode game state:', error);
    return null;
  }
} 