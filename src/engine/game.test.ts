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
import type { GameState, Card, PlayerState } from '../types';

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
    const card: Card = {
      id: 'p1',
      type: 'Progress',
      name: '100km',
      value: 100,
    };
    const newState = applyCardToPlayer(player, card);
    expect(newState.totalKm).toBe(100);
    expect(newState.inPlay.progress).toContain(card);
  });

  it('should add a block for a Block card', () => {
    const card: Card = {
      id: 'b1',
      type: 'Block',
      name: 'Red Light',
      blocksType: 'Red Light',
    };
    const newState = applyCardToPlayer(player, card);
    expect(newState.inPlay.blocks).toContain(card);
  });

  it('should remove the correct block for a Remedy card', () => {
    const blockCard: Card = {
      id: 'b1',
      type: 'Block',
      name: 'Red Light',
      blocksType: 'Red Light',
    };
    const remedyCard: Card = {
      id: 'r1',
      type: 'Remedy',
      name: 'Green Light',
      remediesType: 'Red Light',
    };

    let stateWithBlock = applyCardToPlayer(player, blockCard);
    expect(stateWithBlock.inPlay.blocks).toHaveLength(1);

    let stateAfterRemedy = applyCardToPlayer(stateWithBlock, remedyCard);
    expect(stateAfterRemedy.inPlay.blocks).toHaveLength(0);
  });

  it('should add an immunity for an Immunity card', () => {
    const card: Card = {
      id: 'i1',
      type: 'Immunity',
      name: 'Right of Way',
      remediesType: 'Red Light',
    };
    const newState = applyCardToPlayer(player, card);
    expect(newState.inPlay.immunities).toContain(card);
  });
}); 