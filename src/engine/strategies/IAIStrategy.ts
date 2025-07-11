import type { GameState, PlayerState } from '../../types';

// Represents the decision made by the AI
export interface AIAction {
  type: 'PLAY_CARD' | 'DISCARD_CARD';
  cardId: string; // The ID of the card to play or discard
}

// The contract for all AI strategies
export interface IAIStrategy {
  /**
   * Analyzes the game state and decides the best move for the AI player.
   * @param aiPlayer The current state of the AI player (e.g., their hand).
   * @param gameState The complete state of the game.
   * @returns The action the AI has decided to take.
   */
  decideMove(aiPlayer: PlayerState, gameState: GameState): AIAction;
} 