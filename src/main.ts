/*
 * src/main.ts
 *
 * This is the main entry point for the RACE card game application.
 * It finds the root HTML element and initializes the main App component,
 * which handles all rendering and state management.
 */
import './ui/ui.css';
import App from './app';

const appElement = document.getElementById('app');

if (!appElement) {
  throw new Error('Root element #app not found');
}

// Instantiate the main application, starting a 2-player game
new App(appElement, 2); 