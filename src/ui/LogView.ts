/*
 * src/ui/LogView.ts
 *
 * This file defines the LogView component, which is responsible for
 * rendering the game's event log. It displays a list of past actions,
 * such as cards being played, drawn, or discarded, allowing players
 * to review the history of the game.
 */
import { html } from 'lit-html';
import type { GameEvent } from '../types';

/**
 * Renders the game event log.
 *
 * This function takes an array of game events and generates an HTML list.
 * Each event is rendered as a list item with a specific CSS class based on its
 * type (e.g., 'play', 'discard'), allowing for rich, structured styling.
 *
 * @param events - An array of GameEvent objects representing the log.
 * @returns A lit-html template result.
 */
export function LogView(events: GameEvent[]) {
  return html`
    <div class="log-view">
      <h3>Game Log</h3>
      <ul>
        ${events.map(
          (event) =>
            html`<li class="log-entry log-entry--${event.type}">
              ${event.message}
            </li>`
        )}
      </ul>
    </div>
  `;
} 