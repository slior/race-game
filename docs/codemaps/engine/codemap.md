# Engine Code Map

## Purpose

This module contains the core game logic for the RACE card game. It is built on the principle of immutability and pure functions, where game state is passed to functions that return a new, modified state. The engine's components use a shared set of type-safe constants and helper functions defined in `src/types.ts` to ensure consistency and prevent common errors.

## Child Components

- [`strategies/`](./strategies/codemap.md): Implements the Strategy design pattern for AI opponents. It provides multiple, interchangeable AI "personalities" that are decoupled from the core game logic.

## Files

- [`cards.ts`](../../../src/engine/cards.ts): Defines the master list of all game cards, using type-safe constants from `types.ts` to construct the deck. This serves as the single source of truth for all card data.
- [`deck.ts`](../../../src/engine/deck.ts): Provides pure functions for deck management, including creating, shuffling, and drawing cards.
- [`game.ts`](../../../src/engine/game.ts): Implements the core game loop and state management. It includes functions for creating the initial game state, applying card effects to players (with immunity checks), advancing turns, and checking for a win condition.
- [`ai.ts`](../../../src/engine/ai.ts): Houses the `AIPlayer` class, which acts as the "Context" for the AI Strategy Pattern, delegating decisions to a concrete strategy object.

## Architecture

The engine is designed with a clear separation of concerns: `deck.ts` manages cards, `game.ts` manages rules and state transitions, and `ai.ts` with its strategies manages opponent logic. This makes the core logic easy to test and reason about. 