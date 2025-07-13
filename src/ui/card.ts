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
  ACCIDENT_NAME,
  BLOCK_TYPE,
  DRIVING_ACE_NAME,
  FLAT_TIRE_NAME,
  FUEL_TANK_NAME,
  GASOLINE_NAME,
  GREEN_LIGHT_NAME,
  IMMUNITY_TYPE,
  OUT_OF_GAS_NAME,
  PROGRESS_100_KM_NAME,
  PROGRESS_200_KM_NAME,
  PROGRESS_25_KM_NAME,
  PROGRESS_50_KM_NAME,
  PROGRESS_75_KM_NAME,
  PROGRESS_TYPE,
  PUNCTURE_PROOF_TIRES_NAME,
  RED_LIGHT_NAME,
  REMEDY_TYPE,
  REPAIR_NAME,
  RIGHT_OF_WAY_NAME,
  SPARE_TIRE_NAME,
  SPEED_LIMIT_NAME,
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
      return '#7f8c8d'; // Grey for others
  }
}

/**
 * Generates an SVG icon based on the card's name.
 *
 * @param card The card for which to generate an icon.
 * @returns A lit-html TemplateResult containing the SVG markup for the icon.
 */
function getCardIcon(card: CardModel): TemplateResult {
  const shield = svg`<path d="M -15 5 H 15 V 25 C 15 35 0 45 0 45 C 0 45 -15 35 -15 25 V 5 Z" fill="white" fill-opacity="0.6" stroke="white" stroke-width="2"/>`;

  switch (card.name) {
    // --- Block Cards ---
    case RED_LIGHT_NAME:
      return svg`<g transform="translate(35, 15)">
        <rect x="-10" y="0" width="20" height="60" rx="10" ry="10" fill="black" />
        <circle cx="0" cy="10" r="8" fill="red" stroke="black" stroke-width="1" />
        <circle cx="0" cy="30" r="8" fill="#444" />
        <circle cx="0" cy="50" r="8" fill="#444" />
      </g>`;
    case FLAT_TIRE_NAME:
      return svg`<g transform="translate(35, 35)">
        <path d="M -20 0 a 20 12 0 1 0 40 0 a 20 12 0 1 0 -40 0" fill="#333" />
        <path d="M -10 0 a 10 6 0 1 0 20 0 a 10 6 0 1 0 -20 0" fill="#888" />
      </g>`;
    case OUT_OF_GAS_NAME:
      return svg`<g transform="translate(35, 20) scale(1.2)">
        <path d="M -10 -15 H 5 V 15 H -10 Z" fill="#eee" stroke="#333" stroke-width="2"/>
        <path d="M 5 0 H 15" stroke="#333" stroke-width="3" />
        <path d="M 15 -5 V 5 L 20 5 V -5 Z" fill="red"/>
      </g>`;
    case ACCIDENT_NAME:
      return svg`<g transform="translate(35, 30) scale(1.5)">
        <path d="M -20 10 L -15 0 L 15 0 L 20 10" stroke="white" stroke-width="2" fill="none"/>
        <path d="M -12 5 L -8 -5 M -8 5 L -12 -5" stroke="red" stroke-width="3" transform="translate(20, 0)"/>
      </g>`;
    case SPEED_LIMIT_NAME:
      return svg`<g transform="translate(35, 35)">
        <circle cx="0" cy="0" r="25" fill="white" />
        <circle cx="0" cy="0" r="23" stroke="red" stroke-width="4" fill="none"/>
        <text x="0" y="8" font-size="24" text-anchor="middle" fill="black" font-weight="bold">50</text>
      </g>`;

    // --- Remedy Cards ---
    case GREEN_LIGHT_NAME:
      return svg`<g transform="translate(35, 15)">
        <rect x="-10" y="0" width="20" height="60" rx="10" ry="10" fill="black" />
        <circle cx="0" cy="10" r="8" fill="#444" />
        <circle cx="0" cy="30" r="8" fill="#444" />
        <circle cx="0" cy="50" r="8" fill="lime" stroke="black" stroke-width="1" />
      </g>`;
    case SPARE_TIRE_NAME:
      return svg`<g transform="translate(35, 35)">
        <circle cx="0" cy="0" r="20" fill="#333" />
        <circle cx="0" cy="0" r="10" fill="#888" />
      </g>`;
    case GASOLINE_NAME:
      return svg`<g transform="translate(35, 20) scale(1.2)">
        <path d="M -10 -15 H 5 V 15 H -10 Z" fill="#eee" stroke="#333" stroke-width="2"/>
        <path d="M 5 0 H 15" stroke="#333" stroke-width="3" />
        <path d="M 15 -5 V 5 L 20 5 V -5 Z" fill="green"/>
      </g>`;
    case REPAIR_NAME:
      return svg`<g transform="translate(35, 35) scale(1.8) rotate(45)">
          <path d="M 0 5 C -3 5 -5 7 -5 10 L -5 15 L 0 15 L 0 12 L 3 12 L 3 28 L 0 28 L 0 25 L -5 25 L -5 30 C -5 33 -3 35 0 35 L 5 35 L 5 30 L 2 30 L 2 10 L 5 10 L 5 5 Z" fill="white" fill-opacity="0.7"/>
        </g>`;
    case RIGHT_OF_WAY_NAME:
      return svg`<g transform="translate(35, 35) scale(1.5)">
        <path d="M 0 -20 L 20 15 L -20 15 Z" fill="white" stroke="red" stroke-width="4"/>
      </g>`;

    // --- Immunity Cards ---
    case PUNCTURE_PROOF_TIRES_NAME:
      return svg`<g transform="translate(35, 30) scale(1.4)">
        ${shield}
        <circle cx="0" cy="20" r="10" fill="#333" />
        <circle cx="0" cy="20" r="5" fill="#888" />
      </g>`;
    case FUEL_TANK_NAME:
      return svg`<g transform="translate(35, 25) scale(1.2)">
        ${shield}
        <g transform="translate(0, 15) scale(0.8)">
          <path d="M -10 -15 H 5 V 15 H -10 Z" fill="#eee" stroke="#333" stroke-width="2"/>
          <path d="M 5 0 H 15" stroke="#333" stroke-width="3" />
          <path d="M 15 -5 V 5 L 20 5 V -5 Z" fill="green"/>
        </g>
      </g>`;
    case DRIVING_ACE_NAME:
      return svg`<g transform="translate(35, 30) scale(1.4)">
        ${shield}
        <path d="M -10 20 L 0 30 L 15 10" stroke="lime" stroke-width="4" fill="none"/>
      </g>`;

    // --- Progress Cards ---
    case PROGRESS_25_KM_NAME:
    case PROGRESS_50_KM_NAME:
    case PROGRESS_75_KM_NAME:
    case PROGRESS_100_KM_NAME:
    case PROGRESS_200_KM_NAME:
      return svg`
        <g transform="translate(35, 10) scale(1)">
          <path d="M 0 0 V 80" stroke-width="6" stroke-dasharray="10" stroke="white" />
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
    <svg class="card-svg" viewBox="0 0 70 98">
      <rect x="0" y="0" width="70" height="98" rx="4" ry="4" fill="${getCardColor(card)}" />
      ${getCardIcon(card)}
      <text x="5" y="92">${card.name}</text>
    </svg>
  `;
} 