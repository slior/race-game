# Active Context: Game Engine Implementation

The project's foundational structure has been successfully set up. The Vite development server is running, all dependencies are installed, and the initial directory structure and type definitions are in place.

## Current Goal
The current focus is on building the core game logic within the **Game Engine Layer**. This involves implementing the rules for managing cards, players, and game flow.

## Next Steps
1.  **Implement the Player and Turn Manager** (`src/engine/game.ts`): Develop the functions to manage player state (hands, cards in play), validate moves based on game rules, and control the turn-based sequence of the game.
2.  **Write Unit Tests**: Create Jest tests for the new game logic to ensure correctness.
3.  **Implement a basic AI**: Develop a simple AI that can take a turn.

This phase will establish the backbone of the game's functionality, upon which the AI and UI layers will be built. 