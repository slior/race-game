# Progress Report

## What Works
*   The project has been initialized with Vite and `npm`.
*   All dependencies (`lit-html`, `jest`, `eslint`, etc.) are installed.
*   The initial directory structure (`src/engine`, `src/ui`) has been created.
*   Core type definitions have been added to `src/types.ts`.
*   The development environment is confirmed to be working with `npm run dev`.
*   The Jest testing environment is fully configured and operational.
*   The core `Deck` manager (`src/engine/deck.ts`) is implemented and fully unit-tested. This includes logic for creating, shuffling, and drawing cards.
*   The core Player and Turn managers (`src/engine/game.ts`) are implemented and fully unit-tested. This includes logic for creating a game state, applying card effects, advancing turns, and checking win conditions.
*   **A basic AI opponent is implemented (`src/engine/strategies`) using a Strategy pattern.** This includes a balanced `HeuristicStrategy` and an `AggressorStrategy`, both of which are fully unit-tested.
*   **The core engine has been refactored to use type-safe constants and helper functions**, eliminating magic strings and improving maintainability.
*   **State & Storage**: URL-based state serialization (`encodeState`) and deserialization (`decodeState`) is implemented and unit-tested.
*   **UI Layer**: The entire UI layer is now implemented. This includes the `PlayerView`, `HandView`, `LogView`, and `ControlsView`. A central `App` component manages state and orchestrates all UI rendering and interactions, including targeting logic for block cards.
*   **UI Enhancements**: The UI has been improved to provide clearer state visibility. A "go" indicator now appears on a player's view when they can play progress cards. The layout has been updated to show the current player's hand directly beneath their player area, creating a more intuitive flow.
*   **Rule Enforcement**: The game's core rules are now robustly enforced by a central `isCardPlayable` helper function and have been validated with an extensive test suite.
*   **Configurable Player Count**: The game now supports a configurable player count (2-4 players). This can be set via a new UI input or by using the `playerCount` URL query parameter.
*   **Configurable AI Players**: Players can be configured as "Human" or one of several AI strategies ("Heuristic", "Aggressor").
*   **Observable AI Turns**: AI players automatically take their turns with asynchronous delays and visual feedback, making their actions easy for a human to follow. The game can be played with all AI players, running by itself until a winner is found.

## What's Left to Build
*   **Documentation**: User and developer guides.
*   **Testing**: End-to-end tests for the complete user flow, especially with multiple AI players interacting.
*   **AI Strategy Refinement**: The current AI strategies are functional but could be made more sophisticated.

## Recent Bug Fixes
*   **Go Indicator Styling Bug**: Fixed a visual bug where the green "go" indicator was rendering as a squashed oval instead of a circle. The root cause was that the `<span>` element used for the indicator had a default `display: inline` style, which does not respect `width` and `height` properties. The fix was to add `display: inline-block;` to the `.go-indicator` CSS class in `src/ui/ui.css`.
*   **AI Infinite Hand Bug**: Fixed a bug in the `AggressorStrategy` where the AI would fail to make a valid move and never discard, causing its hand to grow indefinitely. The strategy was refactored to use the central `isCardPlayable` function to ensure its chosen move is always valid.
*   **AI Race Condition**: Fixed a critical bug where the game would stall in all-AI matches. The root cause was a race condition in the previous event-based turn management. The system was completely refactored to use a central, asynchronous `gameLoop` that gracefully handles both human and AI turns, eliminating the bug and improving overall stability.
*   **Invalid AI Moves**: Fixed a bug where AI players could attempt to play invalid cards (e.g., a block card against an immune opponent), causing the game to stall. The AI strategies now use the central `isCardPlayable` function to ensure all chosen moves are valid before execution.
*   **Green Light Prerequisite**: Fixed a bug where the rule requiring a "Green Light" before playing progress cards was not enforced.
*   **Initial Green Light Play**: Fixed a bug that prevented players from playing their initial "Green Light" card if they were not blocked.
*   **Block Card Playability**: Fixed a UI bug where the "Play Card" button was incorrectly disabled for block cards.
*   **Progress While Blocked**: Fixed a bug that allowed players to play progress cards while under the effect of a block card.
*   **Test Suite Mocks**: Updated all mock objects in the unit test suites to include the new `isReady` property on the `PlayerState` interface, resolving all test failures.
*   **Repair Card Logic**: Fixed a bug where the "Repair" card was misconfigured to fix a "Flat Tire" instead of an "Accident", preventing players from playing it correctly.
*   **Asynchronous Discard Bug**: Fixed a critical race condition that occurred when a player discarded a card. The root cause was an impure event handler directly modifying the game state and advancing the turn, which conflicted with the main `gameLoop`. This was resolved by refactoring the discard logic into a pure function in the game engine and ensuring the `gameLoop` is the sole manager of turn advancement.

## Current Status
*   **Overall**: The game is feature-complete and the core engine is now highly stable after a major architectural refactoring to fix a critical race condition. The `gameLoop` pattern provides a robust foundation for turn management. The AI is also more robust and makes more intelligent, valid moves.
*   **Next**: Write comprehensive end-to-end tests to validate the full game loop with human and AI players.

## Known Issues
*   None. The application is stable. 