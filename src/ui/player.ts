/*
 * src/ui/player.ts
 *
 * This file defines the PlayerView component, which is responsible for
 * rendering all the information related to a single player. This includes
 * their name, total distance covered, and the cards they have in play
 * (blocks and immunities). It reuses the CardView component to display
 * each card.
 */

import { html, type TemplateResult } from 'lit-html';
import type { PlayerState as PlayerModel } from '../types';
import { renderCard } from './card';

/**
 * Renders the view for a single player.
 *
 * This function generates the HTML for displaying a player's name, their
 * current score (total distance), and a visual representation of all the
 * block and immunity cards they currently have in play.
 *
 * @param player The player object to render.
 * @param playerIndex The index of the player, used for display purposes.
 * @param isTargetable A boolean indicating if the player can be targeted.
 * @param isCurrentPlayer A boolean indicating if this is the current player.
 * @returns A lit-html TemplateResult containing the player's UI.
 */
export function renderPlayer(
  player: PlayerModel,
  playerIndex: number,
  isTargetable: boolean,
  isCurrentPlayer: boolean
): TemplateResult {
  // Combine all cards in play (blocks and immunities) into a single array
  const cardsInPlay = [...player.inPlay.blocks, ...player.inPlay.immunities];

  const onPlayerClick = () => {
    if (!isTargetable) return;
    document.dispatchEvent(
      new CustomEvent('player-selected-as-target', {
        detail: { playerIndex },
      })
    );
  };

  return html`
    <div
      class="player ${isTargetable ? 'targetable' : ''} ${isCurrentPlayer
        ? 'current-player'
        : ''}"
      @click=${onPlayerClick}
    >
      <div class="player-info">
        <h2>Player ${playerIndex + 1}</h2>
        <span>${player.totalKm}km</span>
      </div>
      <div class="cards-in-play">
        ${player.isReady ? html`<div class="go-indicator"></div>` : ''}
        ${cardsInPlay.map(card => renderCard(card))}
      </div>
    </div>
  `;
} 