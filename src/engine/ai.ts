import type { PlayerState, GameState } from '../types';
import type { IAIStrategy, GameAction } from './strategies/IAIStrategy';

/**
 * Represents an AI-controlled player in the game.
 * 
 * The AIPlayer class encapsulates the logic for an automated player, delegating
 * decision-making to a provided strategy that implements the IAIStrategy interface.
 */
export class AIPlayer {
  /**
   * The strategy used by this AI player to decide moves.
   * @private
   */
  private strategy: IAIStrategy;

  /**
   * Constructs a new AIPlayer with the specified strategy.
   * 
   * @param strategy - An object implementing the IAIStrategy interface, which determines the AI's behavior.
   */
  constructor(strategy: IAIStrategy) {
    this.strategy = strategy;
  }

  /**
   * Executes the AI player's turn by delegating the decision-making process to its strategy.
   *
   * This method should be called when it is the AI player's turn. It passes the current
   * state of the AI player and the overall game state to the strategy, which returns
   * the chosen action for this turn.
   *
   * @param aiPlayerState - The current state of the AI player (hand, in-play cards, etc.).
   * @param gameState - The complete state of the game, including all players and cards.
   * @returns The action chosen by the AI strategy for this turn.
   */
  public takeTurn(aiPlayerState: PlayerState, gameState: GameState): GameAction {
    return this.strategy.decideMove(aiPlayerState, gameState);
  }
}
