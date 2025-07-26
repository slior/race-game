/**
 * @file src/engine/ai.ts
 *
 * This file contains the AI player logic, including the context for the
 * Strategy pattern and a factory for creating different AI strategy instances.
 */

import { AggressorStrategy } from './strategies/AggressorStrategy';
import { HeuristicStrategy } from './strategies/HeuristicStrategy';
import type { IAIStrategy, GameAction } from './strategies/IAIStrategy';
import type { PlayerState, GameState } from '../types';

/**
 * Creates an instance of a specific AI strategy based on its name.
 * @param name - The name of the strategy to create (e.g., "Heuristic").
 * @returns An instance of the requested IAIStrategy.
 * @throws An error if the strategy name is unknown.
 */
export function createAIStrategy(name: string): IAIStrategy {
  switch (name) {
    case 'Heuristic':
      return new HeuristicStrategy();
    case 'Aggressor':
      return new AggressorStrategy();
    default:
      throw new Error(`Unknown AI strategy: ${name}`);
  }
}

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
   * @returns The action the AI has decided to take.
   */
  public decideMove(aiPlayer: PlayerState, gameState: GameState): GameAction {
    return this.strategy.decideMove(aiPlayer, gameState);
  }
}
