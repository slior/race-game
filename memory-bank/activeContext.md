# Active Context

## Current Work Focus
The last session focused on fixing a UI styling bug related to the "go" status indicator.

## Recent Changes
- **Fixed Go Indicator Styling**: A visual bug was fixed where the "go" indicator in the player view appeared squashed. The root cause was that the `<span>` element for the indicator had a default `display: inline` property, which does not respect `width` and `height` styles. The issue was resolved by adding `display: inline-block;` to the `.go-indicator` CSS class, allowing it to render as a correctly-proportioned circle.
- **Fixed Asynchronous Race Condition**: A major bug was identified where players' hands would grow indefinitely. The root cause was a race condition between the asynchronous `handleAITurn` function and the main `gameLoop`. An impure `handleDiscardCardRequest` function was mutating state and advancing the turn directly, clashing with the `gameLoop`'s responsibility as the single source of truth for turn progression.
- **Refactored to Pure Functions**: The solution involved refactoring the discard logic into a new, pure `discardCard` function in the game engine (`src/engine/game.ts`).
- **Centralized Turn Management**: All turn advancement logic was removed from individual action handlers and consolidated within the main `gameLoop` in `src/app.ts`. The loop now reliably waits for a player's action to complete, *then* advances the turn. This has made the game's state management much more robust and predictable.

## Next Steps
With the core state management and game loop now stable, the immediate priority is to write comprehensive end-to-end tests. This will validate the fix and ensure long-term stability, especially in complex scenarios with multiple AI players.

## Active Decisions and Considerations
- The pattern of using pure functions for all engine logic (`playCard`, `discardCard`, `advanceTurn`) combined with a single, authoritative `gameLoop` that applies the state changes is now a core architectural principle. All future game logic modifications must adhere to this pattern to prevent similar race conditions. 