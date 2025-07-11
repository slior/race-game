# 003: Use JSON for Game State Serialization

## Context

To make the RACE card game shareable and resumable, the entire `GameState` object needs to be serialized into a string that can be stored in a URL. The chosen serialization format needed to be simple, universally supported in browsers, and sufficient for the project's data structures, which are pure data objects without methods.

Alternatives considered:
-   **Compact Binary Format (e.g., MessagePack):** Offers more efficient and smaller output, but would introduce an external dependency and make the serialized state opaque and harder to debug.
-   **Custom String Format:** Would require writing and maintaining a custom parser and serializer, adding complexity for no significant benefit.

## Decision

We will use the standard `JSON.stringify()` for serialization and `JSON.parse()` for deserialization of the `GameState` object.

## Consequences

-   **Benefits:**
    -   **Simplicity:** Leverages native browser APIs (`JSON.stringify`, `JSON.parse`) with no external dependencies, aligning with the project's minimalist tech stack.
    -   **Readability:** The intermediate JSON format is human-readable, which aids significantly in debugging.
    -   **Sufficiency:** The `GameState` object and its nested properties are simple data structures, so the loss of methods or complex types is not a concern.

-   **Trade-offs:**
    -   **Verbosity:** JSON is more verbose than binary formats, which will lead to longer URL strings. This is an acceptable trade-off for the simplicity and debuggability it offers. We can consider compression later if URL length becomes a practical issue. 