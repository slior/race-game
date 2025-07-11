// src/engine/cards.ts

/**
 * @file This file defines the master list of all cards used in the RACE game.
 * It serves as the single source of truth for card data, ensuring consistency
 * across the game engine.
 */

import type { Card } from '../types';

/**
 * A factory function to create multiple instances of the same card.
 * @param count - The number of cards to create.
 * @param card - The card object template.
 * @returns An array of card instances.
 */
const createCards = (count: number, card: Omit<Card, 'id'>): Card[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...card,
    id: `${card.name.replace(/\s/g, '_')}_${i}`,
  }));
};

/**
 * FULL_DECK contains the complete set of cards for a standard game.
 * The composition is structured to provide a balanced gameplay experience.
 */
export const FULL_DECK: Card[] = [
  // --- Progress Cards (Advances player's score) ---
  ...createCards(10, { type: 'Progress', name: '25km', value: 25 }),
  ...createCards(10, { type: 'Progress', name: '50km', value: 50 }),
  ...createCards(10, { type: 'Progress', name: '75km', value: 75 }),
  ...createCards(12, { type: 'Progress', name: '100km', value: 100 }),
  ...createCards(4, { type: 'Progress', name: '200km', value: 200 }),

  // --- Block Cards (Hinders opponents) ---
  ...createCards(5, { type: 'Block', name: 'Red Light', blocksType: 'Stop' }),
  ...createCards(4, { type: 'Block', name: 'Flat Tire', blocksType: 'Hazard' }),
  ...createCards(4, { type: 'Block', name: 'Out of Gas', blocksType: 'Hazard' }),
  ...createCards(3, { type: 'Block', name: 'Accident', blocksType: 'Hazard' }),
  ...createCards(2, { type: 'Block', name: 'Speed Limit', blocksType: 'Stop' }),

  // --- Remedy Cards (Cancels out Block cards) ---
  ...createCards(14, { type: 'Remedy', name: 'Green Light', remediesType: 'Stop' }),
  ...createCards(5, { type: 'Remedy', name: 'Spare Tire', remediesType: 'Hazard' }),
  ...createCards(5, { type: 'Remedy', name: 'Gasoline', remediesType: 'Hazard' }),
  ...createCards(2, { type: 'Remedy', name: 'Repair', remediesType: 'Hazard' }),

  // --- Immunity Cards (Provides permanent protection) ---
  ...createCards(1, { type: 'Immunity', name: 'Right of Way', remediesType: 'Stop' }),
  ...createCards(1, { type: 'Immunity', name: 'Puncture-Proof Tires', remediesType: 'Hazard' }),
  ...createCards(1, { type: 'Immunity', name: 'Fuel Tank', remediesType: 'Hazard' }),
  ...createCards(1, { type: 'Immunity', name: 'Driving Ace', remediesType: 'Hazard' }),
]; 