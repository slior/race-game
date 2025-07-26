# Engine Code Map

## Purpose

This module contains the core game logic for the RACE card game. It is built on the principle of immutability and pure functions, where game state is passed to functions that return a new, modified state. The engine's components use a shared set of type-safe constants and helper functions defined in `src/types.ts` to ensure consistency and prevent common errors.

## Child Components

- [`strategies/`](./strategies/codemap.md): Implements the Strategy design pattern for AI opponents. It provides multiple, interchangeable AI "personalities" that are decoupled from the core game logic.

## Files

- [`cards.ts`](../../../src/engine/cards.ts): Defines the master list of all game cards, using type-safe constants from `types.ts` to construct the deck. This serves as the single source of truth for all card data.
- [`deck.ts`](../../../src/engine/deck.ts): Provides pure functions for deck management, including creating, shuffling, and drawing cards.
- [`game.ts`](../../../src/engine/game.ts): Implements the core game state management. It includes pure functions for creating the initial game state, applying card effects (`applyCardToPlayer`), processing player actions (`playCard`), advancing turns, and checking for a win condition. This file is central to the game's pure-function architecture.
- [`ai.ts`](../../../src/engine/ai.ts): Provides a factory function (`createAIStrategy`) that takes a strategy name and returns a concrete AI strategy object. This decouples the main application from the specific strategy implementations.

## Architecture

The engine is designed with a clear separation of concerns: `deck.ts` manages cards, `game.ts` manages rules and state transitions, and the `strategies` directory contains opponent logic. This makes the core logic easy to test and reason about. 