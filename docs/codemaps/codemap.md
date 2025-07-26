# Application Core Code Map

## Purpose

This directory contains the main entry point for the application, core data type definitions, and the top-level modules that are wired together to create the game.

## Child Components

- [engine](./engine/codemap.md): Contains the core, stateless game logic. It is built entirely on pure functions that take the current game state and return a new state. It manages player actions (`playCard`), the card deck, and provides a factory for creating AI opponents.
- [ui](./ui/codemap.md): Responsible for rendering the user interface, displaying game state to the user, and handling user input.
- [state](./state/codemap.md): Responsible for game state persistence, providing functions to save and load the game by encoding the state into a URL-safe string.

## Files

- [`main.ts`](../../src/main.ts): The main entry point for the application. It initializes the `App` component and handles the `playerCount` URL parameter to configure the number of players for a new game.
- [`app.ts`](../../src/app.ts): The top-level application component that orchestrates the UI and game state.
- [`types.ts`](../../src/types.ts): Defines the core data structures (`Card`, `PlayerState`, `GameState`) which include unique IDs for players. It also contains a comprehensive set of **exported constants** for all card types and names. Crucially, this file houses the game's most important pure helper functions, including **`isCardPlayable`**, which serves as the single source of truth for all game rule enforcement.

## Architecture

The application is structured into a core engine that manages game logic, a UI layer that handles presentation, and a state module that handles persistence. All components rely on the shared types and constants defined in `types.ts`. 