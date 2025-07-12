/*
 * src/ui/board.ts
 *
 * This file defines the BoardView component, which serves as the main
 * container for the game's UI. It orchestrates the rendering of the
 * entire game state by composing multiple PlayerView components.
 */

import { html, type TemplateResult } from 'lit-html';
import type { GameState as GameStateModel } from '../types';
import { renderPlayer } from './player';

/**
 * Renders the main game board.
 *
 * This function generates the complete UI for the game board by iterating
 * through all players in the game state and rendering a PlayerView component
 * for each one. It serves as the top-level view.
 *
 * @param gameState The entire game state object.
 * @returns A lit-html TemplateResult containing the full game board.
 */
export function renderBoard(gameState: GameStateModel): TemplateResult {
  return html`
    <div class="board">
      ${gameState.players.map((player, index) => renderPlayer(player, index))}
    </div>
  `;
} 