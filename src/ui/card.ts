/*
 * src/ui/card.ts
 *
 * This file defines the logic for rendering a single game card as an SVG.
 * It programmatically generates the SVG markup using lit-html, allowing for
 * dynamic, code-driven visual assets instead of relying on static image files.
 * This approach provides maximum control over the card's appearance.
 */

import { html, type TemplateResult } from 'lit-html';
import {
  BLOCK_TYPE,
  REMEDY_TYPE,
  IMMUNITY_TYPE,
  type Card as CardModel,
} from '../types';

/**
 * Determines the background color of a card based on its type.
 *
 * @param card The card for which to determine the color.
 * @returns A string representing the hex color code.
 */
function getCardColor(card: CardModel): string {
  switch (card.type) {
    case BLOCK_TYPE:
      return '#c0392b'; // Red for hazards/blocks
    case REMEDY_TYPE:
      return '#27ae60'; // Green for remedies
    case IMMUNITY_TYPE:
      return '#2980b9'; // Blue for immunities
    default:
      return '#7f8c8d'; // Grey for others (e.g. Progress)
  }
}

/**
 * Generates an SVG path string for a simple icon based on the card type.
 *
 * @param card The card for which to generate an icon.
 * @returns A string containing SVG path data.
 */
function getCardIcon(card: CardModel): TemplateResult {
  switch (card.type) {
    case BLOCK_TYPE:
      // Simple triangle shape for blocks
      return html`<path d="M 30 10 L 50 45 L 10 45 Z" fill-opacity="0.5" />`;
    case REMEDY_TYPE:
      // Simple plus shape for remedies
      return html`<path d="M 20 30 H 40 M 30 20 V 40" stroke="white" stroke-width="4" stroke-opacity="0.5" />`;
    case IMMUNITY_TYPE:
      // Simple shield shape for immunities
      return html`<path d="M 15 15 H 45 V 35 C 45 45 30 55 30 55 C 30 55 15 45 15 35 V 15 Z" fill-opacity="0.5" />`;
    default:
      return html``; // No icon for other card types
  }
}

/**
 * Renders a single game card as an SVG.
 * The SVG is generated programmatically based on the card's properties.
 *
 * @param card The card object to render.
 * @returns A lit-html TemplateResult containing the SVG markup.
 */
export function renderCard(card: CardModel): TemplateResult {
  return html`
    <svg class="card-svg" viewBox="0 0 60 84">
      <rect x="0" y="0" width="60" height="84" rx="4" ry="4" fill="${getCardColor(card)}" />
      ${getCardIcon(card)}
      <text x="5" y="78">${card.name}</text>
    </svg>
  `;
} 