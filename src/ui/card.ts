/*
 * src/ui/card.ts
 *
 * This file defines the logic for rendering a single game card as an SVG.
 * It programmatically generates the SVG markup using lit-html, allowing for
 * dynamic, code-driven visual assets instead of relying on static image files.
 * This approach provides maximum control over the card's appearance.
 */

import { svg, type TemplateResult } from 'lit-html';
import {
  BLOCK_TYPE,
  REMEDY_TYPE,
  IMMUNITY_TYPE,
  PROGRESS_TYPE,
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
    case PROGRESS_TYPE:
      return '#6c757d'; // Dark grey for progress
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
    case PROGRESS_TYPE:
      // A road icon
      return svg`
        <g transform="translate(30, 10) scale(0.8)">
          <path d="M 0 0 V 60" stroke-width="4" stroke-dasharray="8" stroke="white" />
        </g>
      `;
    case BLOCK_TYPE:
      // A stop sign icon
      return svg`
        <g transform="translate(30, 20) scale(1.2)">
          <path
            d="M -8 2 L 8 2 L 18 12 L 18 28 L 8 38 L -8 38 L -18 28 L -18 12 Z"
            fill="#FF0000"
            stroke="white"
            stroke-width="2"
          />
          <text x="0" y="24" text-anchor="middle" font-size="12" fill="white">STOP</text>
        </g>
      `;
    case REMEDY_TYPE:
      // A wrench icon
      return svg`
        <g transform="translate(30, 25) scale(1.4) rotate(45)">
          <path
            d="M 0 5 C -3 5 -5 7 -5 10 L -5 15 L 0 15 L 0 12 L 3 12 L 3 28 L 0 28 L 0 25 L -5 25 L -5 30 C -5 33 -3 35 0 35 L 5 35 L 5 30 L 2 30 L 2 10 L 5 10 L 5 5 Z"
            fill="white"
            fill-opacity="0.7"
          />
        </g>
      `;
    case IMMUNITY_TYPE:
      // An improved shield icon
      return svg`
        <g transform="translate(30, 15) scale(1.2)">
          <path
            d="M -15 5 H 15 V 25 C 15 35 0 45 0 45 C 0 45 -15 35 -15 25 V 5 Z"
            fill="white"
            fill-opacity="0.6"
            stroke="white"
            stroke-width="2"
          />
          <path
            d="M 0 15 L 0 35 M -10 25 L 10 25"
            stroke="#3498db"
            stroke-width="4"
            stroke-opacity="0.8"
          />
        </g>
      `;
    default:
      return svg``; // No icon for other card types
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
  return svg`
    <svg class="card-svg" viewBox="0 0 60 84">
      <rect x="0" y="0" width="60" height="84" rx="4" ry="4" fill="${getCardColor(card)}" />
      ${getCardIcon(card)}
      <text x="5" y="78">${card.name}</text>
    </svg>
  `;
} 