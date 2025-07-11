# Technical Context

This project uses a modern, lightweight, and compiler-supported web stack.

*   **Language:** TypeScript (strict mode) is used for all code to ensure type safety and maintainability.
*   **UI Framework:** The UI is built with vanilla TypeScript and `lit-html` for efficient templating. This avoids the overhead of a larger framework like React or Vue.
*   **Build Tool:** Vite serves as the bundler and development server, providing fast Hot Module Replacement (HMR).
*   **Package Manager:** `npm` is used for managing project dependencies and running scripts.
*   **Code Quality:** ESLint and Prettier are configured to enforce a consistent code style and catch potential errors.
*   **Testing:** Jest is the chosen framework for writing and running unit tests, particularly for the game's core logic.
*   **Documentation:** Project documentation is maintained in Markdown files. `TypeDoc` will be used to generate API documentation from TSDoc comments in the code. 