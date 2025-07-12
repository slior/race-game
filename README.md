# RACE Card Game

A web-based, multiplayer card game where the goal is to be the first to complete a 1000 km road trip. This project is a digital adaptation of the card game "RACE" by Shafir Games.

This is a turn-based game for 2-4 players. The game involves drawing and playing cards, which can be progress, block, remedy, or immunity cards. The entire game state is stored in the URL, allowing you to share your game or resume it at any time just by sharing the link.

## Table of Contents

- [Game Origin](#game-origin)
- [How to Play](#how-to-play)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Running](#installation--running)
- [Running Tests](#running-tests)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Game Origin

This project is a fan-made digital version of the card game "RACE". You can find more about the original game here:
- **[Shafir Games: RACE](https://www.shafirgames.com/ourgames/race)**

## How to Play

The core gameplay is simple: on your turn, you draw one card and then play one card.

1.  **Objective**: Be the first player to reach 1000 km.
2.  **Card Types**:
    *   **Progress Cards**: Advance your own kilometer score.
    *   **Block Cards**: Play on opponents to stop them from making progress (e.g., "Red Light", "Flat Tire").
    *   **Remedy Cards**: Cancel out block cards played on you.
    *   **Immunity Cards**: Provide permanent protection from a specific type of block.
3.  **The Green Light Rule**: You must have a "Green Light" card in play before you can play any progress cards.

For a full breakdown of the rules, components, and project architecture, please see our detailed [documentation](./memory-bank/).

## Features

- **Multiplayer Gameplay**: Play with 2-4 players.
- **AI Opponents**: Includes a basic AI with multiple strategies to play against.
- **Shareable State**: The entire game state is encoded in the URL hash. Share the URL to continue a game with friends.
- **Responsive UI**: A clean and simple interface that works on modern web browsers.

## Tech Stack

- **Language**: TypeScript (Strict)
- **UI**: Vanilla JS with `lit-html` for templating
- **Build Tool**: Vite
- **Testing**: Jest
- **Code Quality**: ESLint & Prettier

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

- **Node.js**: It is recommended to use Node.js v22 or later. We suggest using [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) to manage your Node.js versions.

### Installation & Running

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd race-game
    ```

2.  **Install the correct Node.js version:**
    ```sh
    # If you have nvm installed, this will use the version from the .nvmrc file
    nvm use
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Running Tests

To run the unit tests, use the following command:
```sh
npm test
```

## Documentation

This project maintains a "Memory Bank" of documentation that serves as the single source of truth for all project context, including:
- Product requirements
- System architecture
- Technical decisions
- Current progress

You can find the complete documentation in the [`./memory-bank/`](./memory-bank/) directory.

## Contributing

Contributions are welcome! This project is a great way to get involved in a fun, open-source game. If you'd like to contribute, please feel free to fork the repository and submit a pull request.

Some ideas for contributions can be found in our [`progress.md`](./memory-bank/progress.md) file, under the "What's Left to Build" section.

When contributing, please ensure your code adheres to the project's style guidelines by running ESLint and Prettier.

## License

This project is not yet licensed.
