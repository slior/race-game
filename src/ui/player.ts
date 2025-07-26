/*
 * src/ui/player.ts
 *
 * This file defines the PlayerView component, which is responsible for
 * rendering all the information related to a single player. This includes
 * their name, total distance covered, and the cards they have in play
 * (blocks and immunities). It reuses the CardView component to display
 * each card.
 */

import { renderCard } from './card';
import type { PlayerState } from '../types';
import { hasGreenLight, isBlocked } from '../types';
import { html, type TemplateResult } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';

/**
 * Renders the view for a single player.
 *
 * This component displays the player's name, their total distance, their
 * in-play cards (progress, blocks, immunities), and visual indicators for
 * their current status (e.g., if it's their turn or they are targetable).
 *
 * @param player - The state object for the player.
 * @param playerIndex - The index of the player.
 * @param isTargetable - Whether the player can be targeted by a block card.
 * @param isCurrentPlayer - Whether it is this player's turn.
 * @returns A lit-html template result.
 */
export function renderPlayer(
  player: PlayerState,
  playerIndex: number,
  isTargetable: boolean,
  isCurrentPlayer: boolean
): TemplateResult {
  // Combine all cards in play (blocks and immunities) into a single array
  const cardsInPlay = [...player.inPlay.blocks, ...player.inPlay.immunities];

  const onPlayerClick = (e: Event) => {
    e.stopPropagation();
    if (!isTargetable) return;
    document.dispatchEvent(
      new CustomEvent('player-selected-as-target', {
        detail: { playerIndex },
      })
    );
  };

  const playerClasses = {
    player: true,
    'current-player': isCurrentPlayer,
    targetable: isTargetable,
    targeted: player.isTargeted,
    thinking: player.isThinking,
  };

  return html`
    <div
      class=${classMap(playerClasses)}
      data-player-index=${playerIndex}
      @click=${onPlayerClick}
    >
      <div class="player-header">
        <h3>
          Player ${playerIndex + 1}
          ${player.aiStrategy ? html`<i>(${player.aiStrategy})</i>` : ''}
        </h3>
        ${player.isThinking ? html`<span class="thinking-indicator">Thinking...</span>` : ''}
        <div class="player-info">
          <span>${player.totalKm}km</span>
          <div class="status-indicators">
            ${isCurrentPlayer && !isBlocked(player) && hasGreenLight(player)
              ? html`<span class="go-indicator"></span>`
              : ''}
          </div>
        </div>
      </div>
      <div class="cards-in-play">
        ${cardsInPlay.map(card => renderCard(card))}
      </div>
    </div>
  `;
} 