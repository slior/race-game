/*
 * src/types.test.ts
 *
 * This file contains unit tests for the helper functions defined in src/types.ts.
 * It focuses on ensuring the correctness of pure functions that perform
 * calculations or checks based on the game state.
 */
import {
  isCardPlayable,
  type GameState,
  type PlayerState,
  type Card,
  PROGRESS_TYPE,
  REMEDY_TYPE,
  BLOCK_TYPE,
  GREEN_LIGHT_NAME,
  BLOCK_STOP_TYPE,
  IMMUNITY_TYPE,
  SPARE_TIRE_NAME,
  BLOCK_FLAT_TIRE_TYPE,
  FLAT_TIRE_NAME,
} from './types';

// Helper to create a mock PlayerState
const createMockPlayer = (overrides: Partial<PlayerState> & { id: string }): PlayerState => ({
  hand: [],
  inPlay: { progress: [], blocks: [], immunities: [] },
  totalKm: 0,
  isReady: false,
  ...overrides,
});

// Helper to create a mock GameState
const createMockGameState = (players: PlayerState[], turnIndex = 0): GameState => ({
  players,
  deck: [],
  discard: [],
  turnIndex,
  actionState: null,
  events: [],
});

describe('isCardPlayable', () => {
  const greenLightCard: Card = { id: 'c1', type: REMEDY_TYPE, name: GREEN_LIGHT_NAME, remediesType: BLOCK_STOP_TYPE };
  const progressCard: Card = { id: 'c2', type: PROGRESS_TYPE, name: '100km', value: 100 };
  const stopCard: Card = { id: 'c3', type: BLOCK_TYPE, name: 'Red Light', blocksType: BLOCK_STOP_TYPE };
  const immunityCard: Card = { id: 'c5', type: IMMUNITY_TYPE, name: 'Right of Way', remediesType: BLOCK_STOP_TYPE };
  // Use a non-special remedy for general remedy tests
  const flatTireCard: Card = { id: 'c6', type: BLOCK_TYPE, name: FLAT_TIRE_NAME, blocksType: BLOCK_FLAT_TIRE_TYPE };
  const spareTireRemedy: Card = { id: 'c7', type: REMEDY_TYPE, name: SPARE_TIRE_NAME, remediesType: BLOCK_FLAT_TIRE_TYPE };


  it('should return false for a progress card if green light is not played', () => {
    const player = createMockPlayer({ id: 'p1' });
    const gameState = createMockGameState([player]);
    expect(isCardPlayable(progressCard, gameState)).toBe(false);
  });

  it('should return true for a progress card if green light IS played', () => {
    const player = createMockPlayer({ id: 'p1', inPlay: { progress: [greenLightCard], blocks: [], immunities: [] } });
    const gameState = createMockGameState([player]);
    expect(isCardPlayable(progressCard, gameState)).toBe(true);
  });

  it('should return false for a remedy card if the corresponding block is not active', () => {
    const player = createMockPlayer({ id: 'p1' });
    const gameState = createMockGameState([player]);
    expect(isCardPlayable(spareTireRemedy, gameState)).toBe(false);
  });

  it('should return true for a remedy card if the corresponding block IS active', () => {
    const player = createMockPlayer({ id: 'p1', inPlay: { progress: [], blocks: [flatTireCard], immunities: [] } });
    const gameState = createMockGameState([player]);
    expect(isCardPlayable(spareTireRemedy, gameState)).toBe(true);
  });

  it('should return false for a block card if the target is immune', () => {
    const player1 = createMockPlayer({ id: 'p1' });
    const player2 = createMockPlayer({ id: 'p2', inPlay: { progress: [], blocks: [], immunities: [immunityCard] } });
    const gameState = createMockGameState([player1, player2]);
    gameState.actionState = { type: 'awaiting-target', cardId: 'c3', targetId: 'p2' };
    expect(isCardPlayable(stopCard, gameState)).toBe(false);
  });

  it('should return true for a block card if the target is NOT immune', () => {
    const player1 = createMockPlayer({ id: 'p1' });
    const player2 = createMockPlayer({ id: 'p2' });
    const gameState = createMockGameState([player1, player2]);
    gameState.actionState = { type: 'awaiting-target', cardId: 'c3', targetId: 'p2' };
    expect(isCardPlayable(stopCard, gameState)).toBe(true);
  });

  it('should return false for a block card if there is no target', () => {
    const player = createMockPlayer({ id: 'p1' });
    const gameState = createMockGameState([player]);
    // No actionState.targetId
    gameState.actionState = { type: 'awaiting-target', cardId: 'c3' };
    expect(isCardPlayable(stopCard, gameState)).toBe(false);
  });
  
  it('should return true for a Green Light card even if no block is active', () => {
    const player = createMockPlayer({ id: 'p1' });
    const gameState = createMockGameState([player]);
    // No blocks are active on the player
    expect(isCardPlayable(greenLightCard, gameState)).toBe(true);
  });

  it('should return false for a second Green Light card if not blocked', () => {
    // Player already has a green light and is not blocked
    const player = createMockPlayer({ id: 'p1', inPlay: { progress: [greenLightCard], blocks: [], immunities: [] } });
    const gameState = createMockGameState([player]);
    expect(isCardPlayable(greenLightCard, gameState)).toBe(false);
  });

  it('should return true for a block card before a target has been selected', () => {
    const player = createMockPlayer({ id: 'p1', hand: [stopCard] });
    const gameState = createMockGameState([player]);
    // No target is selected yet, but the card should be considered playable from the hand.
    expect(isCardPlayable(stopCard, gameState)).toBe(true);
  });

  it('should return false for a progress card if the player is blocked', () => {
    // Player has a green light, but is also blocked
    const player = createMockPlayer({ 
      id: 'p1', 
      inPlay: { progress: [greenLightCard], blocks: [stopCard], immunities: [] } 
    });
    const gameState = createMockGameState([player]);
    expect(isCardPlayable(progressCard, gameState)).toBe(false);
  });
}); 