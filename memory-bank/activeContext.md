# Active Context

## Current Work Focus
The primary goal of the last session was to implement a feature allowing the user to select the number of players for the game, from 2 to 4. This needed to be configurable through both a UI element and a URL parameter.

## Recent Changes
-   **Player Count UI**: Added a settings section to the UI with a number input and a "Start New Game" button. This allows users to change the number of players.
-   **Game Restart Logic**: Implemented logic to handle restarting the game with a new player count. This includes a confirmation prompt to prevent accidental loss of progress.
-   **URL Parameter**: The application now accepts a `playerCount` URL query parameter (e.g., `?playerCount=3`) to set the number of players on load.
-   **Documentation**: Updated the `systemPatterns.md`, `progress.md`, and relevant codemaps to reflect these new capabilities.

## Next Steps
The player count feature is now complete. The next focus should be on writing comprehensive documentation or moving to end-to-end testing, as outlined in `progress.md`.

## Active Decisions and Considerations
- The decision to use a simple `window.confirm()` for the restart warning is sufficient for the current scope but could be replaced with a more integrated UI modal in the future.
- The player count is validated to be within the 2-4 range. 