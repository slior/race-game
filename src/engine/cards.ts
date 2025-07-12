// src/engine/cards.ts

/**
 * @file This file defines the master list of all cards used in the RACE game.
 * It serves as the single source of truth for card data, ensuring consistency
 * across the game engine.
 */

import { BLOCK_ACCIDENT_TYPE, BLOCK_FLAT_TIRE_TYPE, BLOCK_OUT_OF_GAS_TYPE, 
         BLOCK_STOP_TYPE, BLOCK_TYPE, FLAT_TIRE_NAME, IMMUNITY_TYPE,
         PROGRESS_TYPE, RED_LIGHT_NAME, REMEDY_TYPE, type Card,
         ACCIDENT_NAME, GREEN_LIGHT_NAME, OUT_OF_GAS_NAME, SPEED_LIMIT_NAME,
         SPARE_TIRE_NAME, GASOLINE_NAME, REPAIR_NAME,
         RIGHT_OF_WAY_NAME, PUNCTURE_PROOF_TIRES_NAME, FUEL_TANK_NAME, DRIVING_ACE_NAME,
         PROGRESS_25_KM_NAME, PROGRESS_50_KM_NAME, PROGRESS_75_KM_NAME, PROGRESS_100_KM_NAME, PROGRESS_200_KM_NAME } from '../types';

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
  ...createCards(10, { type: PROGRESS_TYPE, name: PROGRESS_25_KM_NAME, value: 25 }),
  ...createCards(10, { type: PROGRESS_TYPE, name: PROGRESS_50_KM_NAME, value: 50 }),
  ...createCards(10, { type: PROGRESS_TYPE, name: PROGRESS_75_KM_NAME, value: 75 }),
  ...createCards(12, { type: PROGRESS_TYPE, name: PROGRESS_100_KM_NAME, value: 100 }),
  ...createCards(4, { type: PROGRESS_TYPE, name: PROGRESS_200_KM_NAME, value: 200 }),

  // --- Block Cards (Hinders opponents) ---
  ...createCards(5, { type: BLOCK_TYPE, name: RED_LIGHT_NAME, blocksType: BLOCK_STOP_TYPE }),
  ...createCards(4, { type: BLOCK_TYPE, name: FLAT_TIRE_NAME, blocksType: BLOCK_FLAT_TIRE_TYPE }),
  ...createCards(4, { type: BLOCK_TYPE, name: OUT_OF_GAS_NAME, blocksType: BLOCK_OUT_OF_GAS_TYPE }),
  ...createCards(3, { type: BLOCK_TYPE, name: ACCIDENT_NAME, blocksType: BLOCK_ACCIDENT_TYPE }),
  ...createCards(2, { type: BLOCK_TYPE, name: SPEED_LIMIT_NAME, blocksType: BLOCK_STOP_TYPE }),

  // --- Remedy Cards (Cancels out Block cards) ---
  ...createCards(14, { type: REMEDY_TYPE, name: GREEN_LIGHT_NAME, remediesType: BLOCK_STOP_TYPE }),
  ...createCards(5, { type: REMEDY_TYPE, name: SPARE_TIRE_NAME, remediesType: BLOCK_FLAT_TIRE_TYPE }),
  ...createCards(5, { type: REMEDY_TYPE, name: GASOLINE_NAME, remediesType: BLOCK_OUT_OF_GAS_TYPE }),
  ...createCards(2, { type: REMEDY_TYPE, name: REPAIR_NAME, remediesType: BLOCK_FLAT_TIRE_TYPE }),

  // --- Immunity Cards (Provides permanent protection) ---
  ...createCards(1, { type: IMMUNITY_TYPE, name: RIGHT_OF_WAY_NAME, remediesType: BLOCK_STOP_TYPE }),
  ...createCards(1, { type: IMMUNITY_TYPE, name: PUNCTURE_PROOF_TIRES_NAME, remediesType: BLOCK_FLAT_TIRE_TYPE }),
  ...createCards(1, { type: IMMUNITY_TYPE, name: FUEL_TANK_NAME, remediesType: BLOCK_OUT_OF_GAS_TYPE }),
  ...createCards(1, { type: IMMUNITY_TYPE, name: DRIVING_ACE_NAME, remediesType: BLOCK_ACCIDENT_TYPE }),
]; 