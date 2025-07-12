# AI Strategies Code Map

## Purpose

This module implements the Strategy design pattern for the game's AI opponents. It defines a common interface for all AI decision-making and provides multiple, interchangeable strategy implementations. The strategies are designed to be "pure" in that they rely on helper functions and constants from `src/types.ts` rather than implementing their own logic for common tasks like checking immunities or finding the lead player.

## Files

- [`IAIStrategy.ts`](../../../../src/engine/strategies/IAIStrategy.ts): Defines the core contract for all AI strategies.
  - `IAIStrategy`: An interface requiring a `decideMove()` method.
  - `GameAction`: A type that represents the move an AI decides to make.
  - `newGameAction()`: A helper function to create a `GameAction` object.
- [`HeuristicStrategy.ts`](../../../../src/engine/strategies/HeuristicStrategy.ts): A balanced, rule-based AI behavior that prioritizes self-preservation (playing remedies), then making progress, then hindering opponents.
- [`AggressorStrategy.ts`](../../../../src/engine/strategies/AggressorStrategy.ts): An aggressive AI behavior that prioritizes blocking the lead opponent over making its own progress.

## Architecture

This module is a direct implementation of the **Strategy Pattern**. The `AIPlayer` class (defined in `src/engine/ai.ts`) acts as the "Context" and is composed with an object that implements the `IAIStrategy` interface. This decouples the AI player from the concrete decision-making logic, allowing its behavior to be changed easily by injecting a different strategy object.

## Dependencies

- `src/types.ts`: Relies heavily on helper functions (`isImmuneTo`, `getLeader`, etc.) and type-safe constants (`BLOCK_TYPE`, `REMEDY_TYPE`, etc.) to make decisions.
- `src/engine/ai.ts`: The `AIPlayer` class consumes the strategies defined here. 