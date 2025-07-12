# 004: Programmatic SVG for Card Rendering

## Status

ACCEPTED: 2025-07-12

## Context

For the UI of the RACE card game, we need to display various cards (Blocks, Remedies, Immunities) on the game board. The visual representation must be clear, efficient, and maintainable.

Several alternatives were considered:
- **Static Image Assets (PNG/JPG)**: Simple to implement but not scalable, hard to theme, and increases asset loading.
- **Pre-made SVG Icons**: Better than raster images, as they are scalable and can be styled with CSS. However, this creates a dependency on an external icon set and still requires managing a collection of static files.
- **Programmatic SVG Rendering**: Generating card visuals directly in code using `lit-html` and `<svg>` elements.

## Decision

We will use **programmatic SVG rendering** to create the visuals for all game cards. A dedicated `CardView` component will be responsible for generating an SVG template based on a card's properties (type, name).

## Consequences

- **Benefits**:
  - **Zero External Dependencies**: The card visuals are part of the source code, eliminating the need to manage external image or icon files.
  - **Maximum Flexibility**: The appearance of cards can be easily modified, themed, or even animated by changing the rendering logic.
  - **Consistency**: A single source of truth for card visuals ensures they all share a consistent design language.
  - **Performance**: SVGs are lightweight and render efficiently in the browser.

- **Trade-offs**:
  - **Increased Initial Complexity**: This approach requires more initial development effort to write the SVG generation code compared to just linking to an image. However, this is a one-time cost.

- **Impact**:
  - This sets a precedent for creating other dynamic visual assets in the application using code rather than static files, reinforcing the project's lightweight, self-contained ethos. 