# System Patterns

The application is structured into three distinct layers, promoting a clear separation of concerns. The UI layer is orchestrated by a central `App` component.

```mermaid
flowchart TD
    subgraph UI Layer
        direction TD
        App

        subgraph "Views"
            direction LR
            PlayerView
            HandView
            LogView
            ControlsView
            GameSettingsView
        end

        App --> PlayerView
        App -- Renders for current player --> HandView
        App --> LogView
        App --> ControlsView
        App --> GameSettingsView
    end

    subgraph Game Engine Layer
        direction LR
        Deck
        Player
        TurnMgr
        AI
    end

    subgraph State & Storage Layer
        direction LR
        GameState
        URLSerialization
    end

    App --> Game_Engine_Layer
    Game_Engine_Layer --> State_Storage_Layer

    style UI_Layer fill:#f9f,stroke:#333,stroke-width:2px
    style Game_Engine_Layer fill:#ccf,stroke:#333,stroke-width:2px
    style State_Storage_Layer fill:#cfc,stroke:#333,stroke-width:2px
```

## 1. UI Layer

*   **Responsibilities**: Renders the game state and captures user input.
*   **Pattern**: The UI is managed by a central `App` component (`app.ts`) which holds the application state. It renders a set of stateless view components and handles events from them. When the state changes, the `App` re-renders the necessary parts of the UI. This creates a unidirectional data flow.
    *   `App`: The orchestrator. Manages state and the render loop. It now renders each player's view directly.
    *   `PlayerView`: Shows a single player's progress, status, and in-play cards. Includes a "go" indicator.
    *   `HandView`: Displays the current player's cards. It is now rendered directly below the current player's `PlayerView`.
    *   `LogView`: A running log of game events.
    *   `ControlsView`: UI buttons for game actions.
    *   `GameSettingsView`: A new component that allows the user to configure the number of players and start a new game.

## 2. Game Engine Layer

*   **Responsibilities**: Contains the core game logic and rules.
    *   `Deck`: Manages the card deck (shuffling, drawing, discarding).
    *   `Player`: Represents a player's state (hand, cards in play).
    *   `TurnMgr`: Manages turn order and win conditions.
    *   `AI`: Provides a simple opponent strategy.
*   **Pattern**: This layer is stateless in the sense that it operates on the game state provided to it. It exposes functions that take the current state and a user action, and return a new, updated state.

## 3. State & Storage Layer

*   **Responsibilities**: Manages the application's single source of truth and handles persistence.
*   **Pattern**:
    *   **Single State Object**: The entire game state is held in a single JavaScript object (`GameState`).
    *   **State Serialization**: On every state change, the `GameState` object is serialized to a Base64-encoded JSON string.
    *   **URL Persistence**: This string is stored in the browser's URL hash (`window.location.hash`). This makes the game state bookmarkable and shareable. On page load, the application checks for a hash and, if present, decodes it to restore the game.

## 4. Core Engine Patterns

*   **Type-Safe Constants**: All magic strings (card names, types, etc.) are defined as exported constants in `src/types.ts`. This ensures consistency and allows for static type checking, preventing typos and runtime errors.
*   **Centralized Rule Enforcement**: A single, pure function, `isCardPlayable(card, gameState)`, serves as the definitive source of truth for all card playability rules. It resides in `src/types.ts` and is used by both the UI layer (to enable/disable buttons) and the AI strategies (to make legal moves). This ensures that rules are consistent across the entire application and easy to test.
*   **Helper Functions**: Common logic, such as checking for immunity (`isImmuneTo`), green lights (`hasGreenLight`), or finding a player's opponents (`getPlayersOpponents`), is extracted into pure, reusable helper functions within `src/types.ts` and `src/engine/game.ts`. This promotes code reuse and simplifies component logic (like AI Strategies).
*   **Centralized Card Definitions**: The master list of all game cards is defined in `src/engine/cards.ts`, using the aforementioned type-safe constants. This serves as the single source of truth for all card data. 