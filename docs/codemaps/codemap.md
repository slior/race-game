# Application Core Code Map

## Purpose
This module contains the main entry point for the application, core data type definitions, and initial setup logic. It wires together the different parts of the application, including the game engine and UI.

## Child Components
- [engine](./engine/codemap.md): Contains the core game logic for the race game, including game state management, player actions, and AI opponents.
- [ui](./ui/codemap.md): Responsible for rendering the user interface of the game, displaying game state to the user, and handling user input.
- [state](./state/codemap.md): Responsible for game state persistence, providing functions to save and load the game by encoding the state into a URL-safe string.

## Files
- `main.ts`: The main entry point of the application. It initializes the UI and sets up the initial page content.
  - [`setupCounter()`](../../src/counter.ts): Imports and calls this function to set up a simple counter for demonstration.
- `counter.ts`: Contains a simple counter implementation, likely for initial setup and testing.
  - [`setupCounter()`](../../src/counter.ts): A function that takes an HTML button element and adds a click listener to increment a counter.
- `types.ts`: Defines the core data structures and types for the game.
  - [`Card`](../../src/types.ts): Interface for a game card.
  - [`PlayerState`](../../src/types.ts): Interface for a player's state.
  - [`GameState`](../../src/types.ts): Interface for the overall game state.

## Architecture
The application is structured into a core engine that manages game logic, a UI layer that handles presentation, and a main module that wires them together. Core data types defined in `types.ts` are shared across the application. 