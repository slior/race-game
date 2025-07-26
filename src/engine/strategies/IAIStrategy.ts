import type { GameState, PlayerState } from '../../types';

export const PLAY_CARD = 'PLAY_CARD';
export const DISCARD_CARD = 'DISCARD_CARD';
export type ActionType = typeof PLAY_CARD | typeof DISCARD_CARD;

// Represents the decision made by the AI
export interface GameAction {
  type: ActionType;
  cardId: string; // The ID of the card to play or discard
  targetId?: string; // Optional: The ID of the player to target
}

/**
 * Creates a new GameAction object representing an action taken by the AI.
 *
 * @param type - The type of action to perform (e.g., PLAY_CARD or DISCARD_CARD).
 * @param cardId - The ID of the card to play or discard.
 * @param targetId - (Optional) The ID of the player to target, if applicable (e.g., when playing a block card).
 * @returns A GameAction object describing the action.
 */
export function newGameAction(type: ActionType, cardId: string, targetId?: string): GameAction {
  return { type, cardId, targetId };
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