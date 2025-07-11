# 001: Use `lit-html` for Rendering

## Status

ACCEPTED: 2025-07-11

## Context

We are building a **purely client-side, browser-based implementation** of the *RACE* card game with:

- **2–4 players**, supporting bots and humans.
- **Rich, dynamic UI**: showing board state, player hands, move logs, and valid actions clearly.
- **Performance considerations**: frequent incremental updates without jank.
- **Minimal dependencies** while leveraging modern browser capabilities.
- **Developer clarity** to support LLM generation, junior developer onboarding, and easy reasoning about state transitions.

**Alternatives considered:**
- **Raw DOM manipulation with Vanilla JS/TS**: zero dependencies, but verbose, repetitive, error-prone for dynamic views, and harder to maintain as UI complexity grows.
- **Full frameworks (React/Vue/Svelte):** powerful, but overkill, adds significant bundle size, requires more tooling, and introduces hidden abstractions we do not need for a static, self-contained game.
- **lit-html:** minimal (~5KB), declarative templating, direct DOM updates, and no hidden state machinery while allowing clean, maintainable dynamic UIs.

## Decision

We will **use `lit-html` for UI rendering** in this project.

## Consequences

- We gain **clean, declarative templates** (`html\`...\``) that update efficiently without the overhead of a virtual DOM.
- We **avoid heavy frameworks** while still achieving clear, maintainable, reactive UI logic.
- Development speed improves when building and updating UI elements (board view, player hands, logs) due to concise, readable templates.
- We add a **small runtime dependency (~5KB)**, which is acceptable within our minimal dependency philosophy.
- We remain compatible with **future refactors to Web Components (Lit Elements)** if we wish to modularize UI elements later.

This choice aligns with **simplicity, performance, clarity, and minimalism** goals for the *RACE* game implementation.
