# Active Context

## Current Work Focus
The last session focused on refining the core game logic, particularly the `playCard` function, to handle invalid moves more gracefully and improve the AI's decision-making process.

## Recent Changes
-   **Refined `playCard` Logic**: The `playCard` function in `src/engine/game.ts` was updated. It no longer advances the turn if an invalid card is played. Instead, it now logs an event indicating the failed attempt, making the game flow more robust and easier to debug.
-   **Smarter AI Strategies**: The AI strategies (e.g., `AggressorStrategy`) were updated to use the centralized `isCardPlayable` helper function. This ensures that the AI only attempts to make valid moves, preventing it from getting stuck or making illegal plays.
-   **Test Suite Updates**: The test suites for the game engine and AI strategies (`game.test.ts`, `AggressorStrategy.test.ts`) were updated to reflect the new `playCard` behavior and validate the improved AI logic.

## Next Steps
With the core game engine and AI being more robust, the focus can now shift to end-to-end testing of the full game loop, especially with multiple AI players. Further refinement of AI strategies to add more sophisticated behaviors is also a good next step.

## Active Decisions and Considerations
- The use of pure functions and centralized helper functions (`isCardPlayable`) continues to be a successful pattern. It should be maintained for all new game logic.
- The game event log has become more important for tracking both successful and failed actions. This could be enhanced in the UI to be more visible to the player. 