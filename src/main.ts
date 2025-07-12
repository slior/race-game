/*
 * src/main.ts
 *
 * This is the main entry point for the RACE card game application.
 * It sets up the initial game state, imports the necessary UI components
 * and styles, and contains the main render loop that updates the UI
 * whenever the state changes.
 */
import './ui/ui.css';
import { render } from 'lit-html';
import { createInitialGameState } from './engine/game';
import { renderBoard } from './ui/board';
import type { GameState } from './types';

// The main container element for the application
const appElement = document.getElementById('app');

// If the app element doesn't exist, we can't proceed.
if (!appElement) {
  throw new Error('Root element #app not found');
}

// Create a sample game state for initial rendering
// In a real application, this would be loaded from the URL or a server.
const gameState: GameState = createInitialGameState(2); // Create a game for 2 players

/**
 * The main render function for the application.
 *
 * It takes the current game state and renders the entire UI
 * into the main application container.
 *
 * @param state The current game state.
 */
function renderApp(state: GameState) {
  const boardTemplate = renderBoard(state);
  render(boardTemplate, appElement!);
}

// Initial render of the application
renderApp(gameState); 