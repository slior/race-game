# Engine Code Map

## Purpose

This module contains the core game logic for the RACE card game, including game state management, player actions, and the AI player context.

## Child Components

- [`strategies/`](./strategies/codemap.md): Implements the Strategy design pattern for AI opponents, providing interchangeable decision-making logic.

## Files

- `cards.ts`: Defines the master list of all cards used in the game, serving as a single source of truth for card data.
- `deck.ts`: Provides pure functions for deck management, including creating, shuffling, and drawing cards.
- `game.ts`: Implements the core game loop and state management using pure functions. It handles player/turn management, game initialization, and win conditions.
- `ai.ts`: Houses the `AIPlayer` class, which acts as the context for the AI Strategy Pattern, delegating decisions to a concrete strategy. 