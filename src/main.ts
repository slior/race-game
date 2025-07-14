/*
 * src/main.ts
 *
 * This is the main entry point for the RACE card game application.
 * It finds the root HTML element, checks for a 'playerCount' URL
 * parameter, and initializes the main App component, which handles all
 * rendering and state management.
 */
import './ui/ui.css';
import App from './app';

const appElement = document.getElementById('app');

if (!appElement) {
  throw new Error('Root element #app not found');
}

// Check for playerCount URL parameter
const params = new URLSearchParams(window.location.search);
const playerCountParam = params.get('playerCount');
let playerCount = 2; // Default player count

if (playerCountParam) {
  const parsedPlayerCount = parseInt(playerCountParam, 10);
  if (!isNaN(parsedPlayerCount) && App.isValidPlayerCount(parsedPlayerCount)) {
    playerCount = parsedPlayerCount;
  }
}

// Instantiate the main application
new App(appElement, playerCount); 