/**
 * @file This file contains the core logic for managing the game's deck of cards.
 * It provides pure functions for creating, shuffling, and drawing cards,
 * adhering to the stateless nature of the game engine.
 */

import type { Card } from '../types';
import { FULL_DECK } from './cards';

/**
 * Creates a new, ordered deck of cards for the start of a game.
 * This function returns a copy of the master deck to prevent mutation of the original.
 * @returns A fresh array of Card objects.
 */
export const createDeck = (): Card[] => {
  // Return a shallow copy to ensure the original FULL_DECK is not modified.
  return [...FULL_DECK];
};

/**
 * Shuffles an array of cards using the Fisher-Yates (Knuth) shuffle algorithm.
 * This is an unbiased shuffle that ensures every card has an equal chance of being anywhere in the deck.
 * @param cards - The array of cards to shuffle.
 * @returns A new array containing the same cards in a random order.
 */
export const shuffle = (cards: Card[]): Card[] => {
  // Create a copy to avoid mutating the original array.
  const shuffled = [...cards];
  let currentIndex = shuffled.length;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  return shuffled;
};

/**
 * Draws a specified number of cards from the deck.
 * If the deck runs out of cards, it automatically reshuffles the discard pile to form a new deck.
 * @param deck - The current deck of cards.
 * @param discard - The current discard pile.
 * @param count - The number of cards to draw.
 * @returns An object containing the drawn cards, the new deck, and the new discard pile.
 */
export const draw = (
  deck: Card[],
  discard: Card[],
  count: number
): { drawn: Card[]; newDeck: Card[]; newDiscard: Card[] } => {
  let currentDeck = [...deck];
  let currentDiscard = [...discard];
  const drawn: Card[] = [];

  // If the deck doesn't have enough cards, reshuffle the discard pile into it.
  if (currentDeck.length < count) {
    const shuffledDiscard = shuffle(currentDiscard);
    currentDeck = [...currentDeck, ...shuffledDiscard];
    currentDiscard = [];
  }

  // Draw the specified number of cards, or as many as are available.
  const numToDraw = Math.min(count, currentDeck.length);
  const drawnCards = currentDeck.splice(0, numToDraw);
  drawn.push(...drawnCards);

  return {
    drawn: drawn,
    newDeck: currentDeck,
    newDiscard: currentDiscard,
  };
};
