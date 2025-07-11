# State Module Code Map

## Purpose

This module is responsible for managing the application's single source of truth (`GameState`) and handling its persistence. It provides the core mechanisms for saving and loading the game by encoding the entire state into a URL-safe string.

## Architecture

This module follows a simple serialization/deserialization pattern. It takes the in-memory `GameState` object and converts it into a string representation suitable for storage, and vice-versa. There is no internal state managed within this module; it consists of pure functions that operate on the data passed to them.

## Files

- `storage.ts`: Contains the `encodeState` and `decodeState` functions. This is the core of the module, providing the logic for JSON serialization combined with URL-safe Base64 encoding. 