# UI Code Map

## Purpose
This module is responsible for rendering the user interface of the game, displaying game state to the user, and handling user input. It follows a composable pattern, where the UI is broken down into small, reusable components.

## Files
-   `board.ts`: The main `BoardView` component. It consumes the entire `GameState` and assembles the view by rendering a `PlayerView` for each player.
-   `player.ts`: The `PlayerView` component. It is responsible for displaying a single player's information, including their name, score, and cards in play.
-   `card.ts`: The `CardView` component. It programmatically generates an SVG representation of a single card based on its properties.
-   `hand.ts`: The `HandView` component. It renders the current player's hand and handles card selection.
-   `ui.css`: The central stylesheet that provides styling for all components in the UI layer. 