# 002: AI Behavior Implementation using Strategy Pattern

## Context

The project requires an AI opponent for the RACE card game. A key non-functional requirement is the ability to easily define and switch between different AI "personalities" or behaviors (e.g., a balanced player, an aggressive player, a simple progress-focused player). This is necessary for creating varied gameplay experiences and potentially for implementing different difficulty levels in the future.

Alternatives considered:
- **Hard-coded `if/else` logic in a single AI class:** This would be simple initially but would quickly become a large, unmaintainable block of conditional logic. Adding new behaviors would require modifying and potentially breaking existing logic.
- **Inheritance-based approach:** Creating a base `AIPlayer` class and extending it for each behavior. This is a valid OOP approach, but it can lead to rigid hierarchies and doesn't offer the same runtime flexibility as composition.

## Decision

We will implement the AI using the **Strategy design pattern**.

This involves:
1.  Defining an `IAIStrategy` interface with a single `decideMove()` method.
2.  Creating concrete strategy classes (`HeuristicStrategy`, `AggressorStrategy`, etc.) that implement this interface.
3.  An `AIPlayer` class that holds a reference to an `IAIStrategy` object (composition).
4.  The `AIPlayer` delegates the decision-making process to its strategy object at runtime.

## Consequences

- **Benefits:**
    - **Flexibility & Extensibility:** New AI behaviors can be added simply by creating a new class that implements the `IAIStrategy` interface, without touching any existing code.
    - **Separation of Concerns:** The `AIPlayer` is responsible for *when* to act, while the strategies are responsible for *how* to act. This makes the code cleaner and easier to reason about.
    - **Testability:** Each strategy can be unit-tested in complete isolation, verifying its specific logic. The `AIPlayer` can also be tested with mock strategies.

- **Trade-offs:**
    - This pattern introduces a slightly higher number of classes and files compared to a single monolithic AI class, which adds a minor amount of structural complexity. This is a negligible trade-off for the significant gains in maintainability and flexibility. 