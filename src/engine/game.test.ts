/**
 * @file This file contains unit tests for the core game logic in game.ts.
 * It uses the Jest testing framework to verify the correctness of functions
 * related to player state, turn management, and game initialization.
 */

import {
  createInitialGameState,
  advanceTurn,
  checkWinCondition,
  applyCardToPlayer,
} from './game';
import * as deck from './deck';
import {
  type GameState,
  type Card,
  type PlayerState,
  PROGRESS_TYPE,
  BLOCK_TYPE,
  REMEDY_TYPE,
  IMMUNITY_TYPE,
  BLOCK_STOP_TYPE,
} from '../types';

// Mock the shuffle function to ensure predictable deck order for tests
jest.spyOn(deck, 'shuffle').mockImplementation((cards) => cards);

describe('createInitialGameState', () => {
  it('should create a game with the correct number of players', () => {
    const state = createInitialGameState(2);
    expect(state.players).toHaveLength(2);
  });

  it('should deal the correct number of cards to each player', () => {
    const state = createInitialGameState(2, 5);
    expect(state.players[0].hand).toHaveLength(5);
    expect(state.players[1].hand).toHaveLength(5);
  });

  it('should reduce the main deck size by the number of cards dealt', () => {
    const initialDeckSize = deck.createDeck().length;
    const playerCount = 2;
    const handSize = 5;
    const state = createInitialGameState(playerCount, handSize);
    expect(state.deck).toHaveLength(initialDeckSize - playerCount * handSize);
  });

  it('should initialize the turn index to 0', () => {
    const state = createInitialGameState(2);
    expect(state.turnIndex).toBe(0);
  });
});

describe('advanceTurn', () => {
  let state: GameState;

  beforeEach(() => {
    state = createInitialGameState(2);
  });

  it('should advance the turn to the next player', () => {
    const newState = advanceTurn(state);
    expect(newState.turnIndex).toBe(1);
  });

  it('should wrap around to the first player after the last player', () => {
    let newState = advanceTurn(state); // index becomes 1
    newState = advanceTurn(newState); // index should become 0
    expect(newState.turnIndex).toBe(0);
  });
});

describe('checkWinCondition', () => {
  let state: GameState;

  beforeEach(() => {
    state = createInitialGameState(2);
  });

  it('should return null if no player has reached 1000 km', () => {
    expect(checkWinCondition(state)).toBeNull();
  });

  it('should return the winning player if their score is 1000 or more', () => {
    state.players[1].totalKm = 1050;
    expect(checkWinCondition(state)).toBe(state.players[1]);
  });
});

describe('applyCardToPlayer', () => {
  let player: PlayerState;

  beforeEach(() => {
    const initialState = createInitialGameState(1, 0);
    player = initialState.players[0];
  });

  it('should add kilometers for a Progress card', () => {
    const greenLightCard: Card = {
      id: 'r1',
      type: REMEDY_TYPE,
      name: 'Green Light',
      remediesType: BLOCK_STOP_TYPE,
    };
    const card: Card = {
      id: 'p1',
      type: PROGRESS_TYPE,
      name: '100km',
      value: 100,
    };
    // First, play a green light, which is now a prerequisite
    const stateWithGreenLight = applyCardToPlayer(player, greenLightCard);
    const newState = applyCardToPlayer(stateWithGreenLight, card);
    expect(newState.totalKm).toBe(100);
    expect(newState.inPlay.progress).toContain(card);
  });

  it('should add a block for a Block card', () => {
    const card: Card = {
      id: 'b1',
      type: BLOCK_TYPE,
      name: 'Red Light',
      blocksType: BLOCK_STOP_TYPE,
    };
    const newState = applyCardToPlayer(player, card);
    expect(newState.inPlay.blocks).toContain(card);
  });

  it('should remove the correct block for a Remedy card', () => {
    const blockCard: Card = {
      id: 'b1',
      type: BLOCK_TYPE,
      name: 'Red Light',
      blocksType: BLOCK_STOP_TYPE,
    };
    const remedyCard: Card = {
      id: 'r1',
      type: REMEDY_TYPE,
      name: 'Green Light',
      remediesType: BLOCK_STOP_TYPE,
    };

    let stateWithBlock = applyCardToPlayer(player, blockCard);
    expect(stateWithBlock.inPlay.blocks).toHaveLength(1);

    let stateAfterRemedy = applyCardToPlayer(stateWithBlock, remedyCard);
    expect(stateAfterRemedy.inPlay.blocks).toHaveLength(0);
  });

  it('should add an immunity for an Immunity card', () => {
    const card: Card = {
      id: 'i1',
      type: IMMUNITY_TYPE,
      name: 'Right of Way',
      remediesType: BLOCK_STOP_TYPE,
    };
    const newState = applyCardToPlayer(player, card);
    expect(newState.inPlay.immunities).toContain(card);
  });
});

describe('Green Light Rule', () => {
  let player: PlayerState;
  const greenLightCard: Card = {
    id: 'r1',
    type: REMEDY_TYPE,
    name: 'Green Light',
    remediesType: BLOCK_STOP_TYPE,
  };
  const progressCard: Card = {
    id: 'p1',
    type: PROGRESS_TYPE,
    name: '100km',
    value: 100,
  };

  beforeEach(() => {
    const initialState = createInitialGameState(1, 0);
    player = initialState.players[0];
  });

  it('should NOT allow playing a progress card if Green Light has not been played', () => {
    const stateAfterProgress = applyCardToPlayer(player, progressCard);
    // Score should not change, and progress card should not be in play
    expect(stateAfterProgress.totalKm).toBe(0);
    expect(stateAfterProgress.inPlay.progress).not.toContain(progressCard);
  });

  it('should allow playing a progress card AFTER a Green Light has been played', () => {
    // First, play the Green Light
    const stateWithGreenLight = applyCardToPlayer(player, greenLightCard);
    expect(stateWithGreenLight.inPlay.progress).toContain(greenLightCard);

    // Then, play the progress card
    const stateAfterProgress = applyCardToPlayer(
      stateWithGreenLight,
      progressCard
    );

    // Score should now be updated
    expect(stateAfterProgress.totalKm).toBe(100);
    expect(stateAfterProgress.inPlay.progress).toContain(progressCard);
  });
});

describe('Complex Rule Interactions', () => {
  let player: PlayerState;
  const greenLightCard: Card = {
    id: 'r1',
    type: REMEDY_TYPE,
    name: 'Green Light',
    remediesType: BLOCK_STOP_TYPE,
  };
  const redLightCard: Card = {
    id: 'b1',
    type: BLOCK_TYPE,
    name: 'Red Light',
    blocksType: BLOCK_STOP_TYPE,
  };

  beforeEach(() => {
    const initialState = createInitialGameState(1, 0);
    // Player has a green light in play from a previous turn
    player = applyCardToPlayer(initialState.players[0], greenLightCard);
    expect(player.inPlay.progress).toContain(greenLightCard);
    expect(player.inPlay.blocks).toHaveLength(0);
  });

  it('should apply a Red Light block to a player who already has a Green Light in play', () => {
    const finalState = applyCardToPlayer(player, redLightCard);
    // The Red Light should now be in the player's blocks array
    expect(finalState.inPlay.blocks).toHaveLength(1);
    expect(finalState.inPlay.blocks[0]).toBe(redLightCard);
  });
}); 