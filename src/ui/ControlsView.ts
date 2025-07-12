/*
 * src/ui/ControlsView.ts
 *
 * This file defines the ControlsView component, which provides the primary
 * action buttons for the player (e.g., "Play Card", "Discard"). It is
 * responsible for capturing user intent and dispatching events that the
 * main application logic can respond to.
 */
import { html } from 'lit-html';

/**
 * Defines the properties for the ControlsView component.
 */
interface ControlsProps {
  selectedCardId: string | null;
  isTargeting: boolean;
}

/**
 * Renders the main action buttons for the player.
 *
 * This component displays "Play Card" and "Discard" buttons. The buttons are
 * enabled or disabled based on whether a card is currently selected. It
 * dispatches custom events ('play-card-requested', 'discard-card-requested')
 * when the buttons are clicked.
 *
 * @param props - The properties for rendering the controls.
 * @returns A lit-html template result.
 */
export function ControlsView({ selectedCardId, isTargeting }: ControlsProps) {
  const canInteract = selectedCardId !== null && !isTargeting;

  const onPlayClick = () => {
    if (!canInteract) return;
    document.dispatchEvent(
      new CustomEvent('play-card-requested', {
        detail: { cardId: selectedCardId },
      })
    );
  };

  const onDiscardClick = () => {
    if (!canInteract) return;
    document.dispatchEvent(
      new CustomEvent('discard-card-requested', {
        detail: { cardId: selectedCardId },
      })
    );
  };

  return html`
    <div class="controls-view">
      <button
        @click=${onPlayClick}
        ?disabled=${!canInteract}
        class="control-button"
      >
        Play Card
      </button>
      <button
        @click=${onDiscardClick}
        ?disabled=${!canInteract}
        class="control-button"
      >
        Discard
      </button>
      ${isTargeting
        ? html`<div class="targeting-indicator">Select a target</div>`
        : ''}
    </div>
  `;
} 