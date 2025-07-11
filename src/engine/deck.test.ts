/**
 * @file This file contains Jest tests for the deck management utility functions.
 * It verifies the correctness of creating, shuffling, and drawing cards.
 */

import { createDeck, shuffle, draw } from './deck';
import { FULL_DECK } from './cards';
import type { Card } from '../types';

describe('Deck Management', () => {
  describe('createDeck', () => {
    it('should return a full deck of cards', () => {
      const deck = createDeck();
      expect(deck.length).toBe(FULL_DECK.length);
    });

    it('should return a new instance of the deck, not a reference', () => {
      const deck = createDeck();
      expect(deck).not.toBe(FULL_DECK);
    });
  });

  describe('shuffle', () => {
    it('should return an array of the same length', () => {
      const deck = createDeck();
      const shuffled = shuffle(deck);
      expect(shuffled.length).toBe(deck.length);
    });

    it('should not mutate the original array', () => {
      const originalDeck = createDeck();
      const originalDeckCopy = [...originalDeck];
      shuffle(originalDeck);
      expect(originalDeck).toEqual(originalDeckCopy);
    });

    it('should contain the same cards, just in a different order', () => {
      const deck = createDeck();
      const shuffled = shuffle(deck);
      // Sorting by ID to compare contents regardless of order.
      const sortedOriginal = [...deck].sort((a, b) => a.id.localeCompare(b.id));
      const sortedShuffled = [...shuffled].sort((a, b) => a.id.localeCompare(b.id));
      expect(sortedShuffled).toEqual(sortedOriginal);
    });

    it('should produce a different order than the original deck', () => {
      const deck = createDeck();
      const shuffled = shuffle(deck);
      // This test has a small chance of failing if the shuffle results in the exact same order.
      // For a 100+ card deck, this is astronomically unlikely.
      expect(shuffled).not.toEqual(deck);
    });
  });

  describe('draw', () => {
    it('should draw the correct number of cards from a full deck', () => {
      const deck = createDeck();
      const discard: Card[] = [];
      const { drawn, newDeck } = draw(deck, discard, 5);

      expect(drawn.length).toBe(5);
      expect(newDeck.length).toBe(deck.length - 5);
    });

    it('should return the drawn cards from the top of the deck', () => {
      const deck = createDeck();
      const discard: Card[] = [];
      const topFive = deck.slice(0, 5);
      const { drawn } = draw(deck, discard, 5);

      expect(drawn).toEqual(topFive);
    });

    it('should reshuffle the discard pile when the deck is empty', () => {
      const deck: Card[] = [{ id: 'card_1', name: '25km', type: 'Progress' }];
      const discard: Card[] = [
        { id: 'card_2', name: '50km', type: 'Progress' },
        { id: 'card_3', name: '75km', type: 'Progress' },
      ];

      const { drawn, newDeck, newDiscard } = draw(deck, discard, 3);

      expect(drawn.length).toBe(3);
      expect(newDeck.length).toBe(0); // deck(1) + discard(2) - drawn(3) = 0
      expect(newDiscard.length).toBe(0);
      expect(drawn.map(c => c.id)).toContain('card_1');
    });

    it('should draw all remaining cards if count exceeds available cards', () => {
      const deck: Card[] = [{ id: 'card_1', name: '25km', type: 'Progress' }];
      const discard: Card[] = [{ id: 'card_2', name: '50km', type: 'Progress' }];
      
      const { drawn, newDeck, newDiscard } = draw(deck, discard, 5);

      expect(drawn.length).toBe(2);
      expect(newDeck.length).toBe(0);
      expect(newDiscard.length).toBe(0);
    });

    it('should return empty arrays when no cards can be drawn', () => {
      const deck: Card[] = [];
      const discard: Card[] = [];
      const { drawn, newDeck, newDiscard } = draw(deck, discard, 1);
      
      expect(drawn.length).toBe(0);
      expect(newDeck.length).toBe(0);
      expect(newDiscard.length).toBe(0);
    });
  });
}); 