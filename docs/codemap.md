# Race Game Code Map

## Purpose
This project is a web-based card race game built with TypeScript and Vite. It serves as the root of the entire application, containing the main source code, public assets, and project configuration.

## Child Components
- [src](./codemaps/codemap.md): Contains all the application source code, including the game engine, UI components, and the main application entry point.

## Files
- `package.json`: Defines project dependencies, scripts, and metadata.
- `vite.config.ts`: Configuration file for the Vite development server and build tool.
- `index.html`: The main HTML file that serves as the entry point for the web application.
- `public/`: This directory contains static assets that are publicly served.

## Architecture
The project uses a standard web application structure, with a `src` directory for all source code, a `public` directory for static assets, and configuration files in the root. The application itself is modular, with clear separation between the game logic (`engine`) and the user interface (`ui`). 