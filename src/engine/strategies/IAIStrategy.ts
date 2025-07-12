import type { GameState, PlayerState } from '../../types';

export const PLAY_CARD = 'PLAY_CARD';
export const DISCARD_CARD = 'DISCARD_CARD';
export type ActionType = typeof PLAY_CARD | typeof DISCARD_CARD;

// Represents the decision made by the AI
export interface GameAction {
  type: ActionType;
  cardId: string; // The ID of the card to play or discard
}

export function newGameAction(type: ActionType, cardId: string): GameAction {
  return { type, cardId };
}

// The contract for all AI strategies
export interface IAIStrategy {
  /**
   * Analyzes the game state and decides the best move for the AI player.
   * @param aiPlayer The current state of the AI player (e.g., their hand).
   * @param gameState The complete state of the game.
   * @returns The action the AI has decided to take.
   */
  decideMove(aiPlayer: PlayerState, gameState: GameState): GameAction;
} 