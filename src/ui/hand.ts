/**
 * @file Renders the hand of the current player, allowing them to select a card.
 * @module ui/hand
 */
import { html } from 'lit-html';
import { renderCard as CardView } from './card';
import type { PlayerState, Card } from '../types';

/**
 * @typedef {object} HandViewProps
 * @property {PlayerState} player - The player whose hand is being rendered.
 * @property {Card | null} selectedCard - The currently selected card, or null if no card is selected.
 * @property {(card: Card) => void} onCardSelect - Callback invoked when a card is clicked.
 */

/**
 * Renders the current player's hand, displaying their cards in an interactive fan layout.
 * It handles card selection visuals and forwards selection events to the parent component.
 *
 * @param {HandViewProps} props - The properties for rendering the hand view.
 * @returns {import('lit-html').TemplateResult} The lit-html template for the player's hand.
 */
export const HandView = ({
  player,
  selectedCard,
  onCardSelect,
}: {
  player: PlayerState;
  selectedCard: Card | null;
  onCardSelect: (card: Card) => void;
}) => {
  // External function call:
  // CardView({ card }): Renders a single card SVG.
  // Input: { card: Card }
  // Output: A lit-html template result representing the card.
  return html`
    <div class="hand-container">
      ${player.hand.map(
        (card) => html`
          <div
            class="card-wrapper ${selectedCard === card ? 'selected' : ''}"
            @click=${() => onCardSelect(card)}
            title=${card.name}
          >
            ${CardView(card)}
          </div>
        `
      )}
    </div>
  `;
}; 