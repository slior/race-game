/*
 * src/main.ts
 *
 * This is the main entry point for the RACE card game application.
 * It sets up the initial game state, imports the necessary UI components
 * and styles, and contains the main render loop that updates the UI
 * whenever the state changes.
 */
import './ui/ui.css';
import { html, render } from 'lit-html';
import { createInitialGameState } from './engine/game';
import { renderBoard } from './ui/board';
import { HandView } from './ui/hand';
import type { GameState, Card } from './types';

// The main container element for the application
const appElement = document.getElementById('app');

// If the app element doesn't exist, we can't proceed.
if (!appElement) {
  throw new Error('Root element #app not found');
}

// --- Application State ---
let gameState: GameState = createInitialGameState(2); // Create a game for 2 players
let selectedCard: Card | null = null;

// --- State Update Functions ---

/**
 * Handles the selection of a card from the player's hand.
 * If the clicked card is already selected, it deselects it.
 * Otherwise, it sets the clicked card as the new selected card.
 *
 * @param card The card that was clicked.
 */
function handleCardSelect(card: Card) {
  if (selectedCard === card) {
    // If the same card is clicked again, deselect it
    selectedCard = null;
  } else {
    selectedCard = card;
  }
  // Re-render the application to reflect the change in selection
  renderApp(gameState);
}

/**
 * The main render function for the application.
 *
 * It takes the current game state and renders the entire UI
 * into the main application container.
 *
 * @param state The current game state.
 */
function renderApp(state: GameState) {
  const currentPlayer = state.players[state.turnIndex];

  const appTemplate = html`
    ${renderBoard(state)}
    ${HandView({
      player: currentPlayer,
      selectedCard: selectedCard,
      onCardSelect: handleCardSelect,
    })}
  `;
  render(appTemplate, appElement!);
}

// Initial render of the application
renderApp(gameState); 