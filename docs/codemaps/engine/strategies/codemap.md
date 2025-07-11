# AI Strategies Code Map

## Purpose

This module implements the Strategy design pattern for the game's AI opponents. It defines a common interface for all AI decision-making and provides multiple, interchangeable strategy implementations, each with a distinct "personality".

## Files

- `IAIStrategy.ts`: Defines the core contract for all AI strategies.
  - [`IAIStrategy`](../../../../src/engine/strategies/IAIStrategy.ts): An interface requiring a `decideMove()` method, which analyzes the game state and returns the AI's chosen action.
  - [`AIAction`](../../../../src/engine/strategies/IAIStrategy.ts): A type that represents the move an AI decides to make (`PLAY_CARD` or `DISCARD_CARD`).
- `HeuristicStrategy.ts`: A balanced, rule-based AI behavior.
  - [`HeuristicStrategy`](../../../../src/engine/strategies/HeuristicStrategy.ts): Implements a conservative logic that prioritizes self-preservation (playing remedies), then making progress, then hindering opponents as a lower priority.
- `AggressorStrategy.ts`: An aggressive AI behavior.
  - [`AggressorStrategy`](../../../../src/engine/strategies/AggressorStrategy.ts): Implements a simple, offensive logic that prioritizes blocking the lead opponent over making its own progress.

## Architecture

This module is a direct implementation of the **Strategy Pattern**. The `AIPlayer` class (defined in `src/engine/ai.ts`) acts as the "Context" and is composed with an object that implements the `IAIStrategy` interface. This decouples the AI player from the concrete decision-making logic, allowing its behavior to be changed easily by injecting a different strategy object.

## Dependencies

- `src/types.ts`: Relies on `GameState` and `PlayerState` types to analyze the current game situation. 