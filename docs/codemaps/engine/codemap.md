# Engine Code Map

## Purpose
This module contains the core game logic for the race game, including game state management, player actions, and AI opponents.

## Files
- `cards.ts`: Defines the master list of all cards used in the game, serving as a single source of truth for card data.
- `deck.ts`: Provides pure functions for deck management, including creating, shuffling, and drawing cards.
- `game.ts`: Implements the core game loop and state management using pure functions. It handles player/turn management, game initialization, and win conditions.
- `ai.ts`: Intended to house the logic for AI players. (Currently empty) 