import { AIPlayer } from './ai';
import type { GameState, PlayerState } from '../types';
import {
  type GameAction,
  type IAIStrategy,
  DISCARD_CARD,
  newGameAction,
} from './strategies/IAIStrategy';

// Mock strategy for testing
class MockStrategy implements IAIStrategy {
  decideMove(_aiPlayer: PlayerState, _gameState: GameState): GameAction {
    // Return a predictable action for testing purposes
    return newGameAction(DISCARD_CARD, 'mock-card');
  }
}

describe('AIPlayer', () => {
  it('should delegate move decisions to its strategy', () => {
    // 1. Arrange
    const mockStrategy = new MockStrategy();
    const spy = jest.spyOn(mockStrategy, 'decideMove');
    const aiPlayer = new AIPlayer(mockStrategy);
    
    const playerState: PlayerState = {
      id: 'ai-player',
      hand: [],
      inPlay: { progress: [], blocks: [], immunities: [] },
      totalKm: 0,
    };
    const gameState: GameState = {
      players: [playerState],
      deck: [],
      discard: [],
      turnIndex: 0,
      events: [],
    };

    // 2. Act
    const action = aiPlayer.takeTurn(playerState, gameState);

    // 3. Assert
    expect(action).toEqual(newGameAction(DISCARD_CARD, 'mock-card'));
    expect(spy).toHaveBeenCalledWith(playerState, gameState);
    expect(spy).toHaveBeenCalledTimes(1);

    // Clean up the spy
    spy.mockRestore();
  });
}); 