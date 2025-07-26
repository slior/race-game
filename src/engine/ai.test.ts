import { AIPlayer } from './ai';
import { HeuristicStrategy } from './strategies/HeuristicStrategy';
import type { PlayerState, GameState, Card } from '../types';
import { newGameAction, PLAY_CARD } from './strategies/IAIStrategy';

describe('AIPlayer', () => {
  it('should delegate move decisions to its strategy', () => {
    // 1. Setup
    const mockStrategy = new HeuristicStrategy();
    const aiPlayer = new AIPlayer(mockStrategy);

    // Create a mock card that the strategy will want to play
    const mockCard: Card = {
      id: 'c1',
      type: 'Remedy',
      name: 'Green Light',
      remediesType: 'Stop',
    };

    const playerState: PlayerState = {
      id: 'ai-player',
      hand: [mockCard],
      inPlay: { progress: [], blocks: [], immunities: [] },
      totalKm: 0,
      isReady: false,
      aiStrategy: 'Heuristic',
      isThinking: false,
      isTargeted: false,
    };

    const gameState: GameState = {
      players: [playerState],
      deck: [],
      discard: [],
      turnIndex: 0,
      events: [],
    };

    // Spy on the strategy's decideMove method
    const strategySpy = jest.spyOn(mockStrategy, 'decideMove');
    strategySpy.mockReturnValue(newGameAction(PLAY_CARD, mockCard.id));

    // 2. Act
    const action = aiPlayer.decideMove(playerState, gameState);

    // 3. Assert
    expect(strategySpy).toHaveBeenCalledWith(playerState, gameState);
    expect(action.type).toBe(PLAY_CARD);
    expect(action.cardId).toBe(mockCard.id);

    // Clean up spy
    strategySpy.mockRestore();
  });
}); 