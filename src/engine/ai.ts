import type { PlayerState, GameState } from '../types';
import type { IAIStrategy, AIAction } from './strategies/IAIStrategy';

export class AIPlayer {
  private strategy: IAIStrategy;

  // The strategy is provided on creation
  constructor(strategy: IAIStrategy) {
    this.strategy = strategy;
  }

  public takeTurn(aiPlayerState: PlayerState, gameState: GameState): AIAction {
    // The AI player doesn't think. It just asks its strategy what to do.
    return this.strategy.decideMove(aiPlayerState, gameState);
  }
}
