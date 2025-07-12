# UI Code Map

## Purpose
This module is responsible for rendering the user interface of the game, displaying game state to the user, and handling user input. It is orchestrated by a central `App` component that manages state and renders all other view components.

## Files
-   `app.ts`: The main application component. It manages the central game state, handles all user interaction events, and integrates all other UI components into a single, cohesive view.
-   `board.ts`: The `BoardView` component. It renders the main game board, showing all players and their status. It highlights players who can be targeted.
-   `player.ts`: The `PlayerView` component. Displays a single player's info (name, score, cards in play) and handles being selected as a target.
-   `card.ts`: The `CardView` component. Programmatically generates an SVG representation of a single card.
-   `hand.ts`: The `HandView` component. Renders the current player's hand and dispatches events when a card is selected.
-   `LogView.ts`: A component that displays a rich, scrollable log of game events.
-   `ControlsView.ts`: A component that provides the main action buttons ("Play Card", "Discard") for the player.
-   `ui.css`: The central stylesheet that provides styling for all components in the UI layer. 