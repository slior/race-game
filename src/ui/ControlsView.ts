/*
 * src/ui/ControlsView.ts
 *
 * This file exports a single function, `ControlsView`, which generates the
 * main user controls for playing or discarding a card.
 */
import { html } from 'lit-html';

/**
 * Defines the properties for the ControlsView component.
 */
interface ControlsProps {
  selectedCardId: string | null;
  isTargeting: boolean;
  canPlay: boolean;
  isAITurnInProgress: boolean;
}

/**
 * Renders the main game controls.
 *
 * This component displays the "Play Card" and "Discard" buttons. It uses the
 * provided properties to determine whether the buttons should be enabled or
 * disabled, preventing illegal moves and actions during an AI's turn.
 *
 * @param props - An object containing the control state properties.
 * @returns A lit-html template result.
 */
export function ControlsView({
  selectedCardId,
  isTargeting,
  canPlay,
  isAITurnInProgress,
}: ControlsProps) {
  const onPlay = () =>
    document.dispatchEvent(new CustomEvent('play-card-requested'));
  const onDiscard = () =>
    document.dispatchEvent(new CustomEvent('discard-card-requested'));

  const playButtonDisabled =
    !selectedCardId ||
    isTargeting ||
    !canPlay ||
    isAITurnInProgress;
  const discardButtonDisabled = !selectedCardId || isAITurnInProgress;

  return html`
    <div class="controls-view">
      <button
        id="play-card-btn"
        class="control-button"
        @click=${onPlay}
        ?disabled=${playButtonDisabled}
      >
        Play Card
      </button>
      <button
        id="discard-card-btn"
        class="control-button"
        @click=${onDiscard}
        ?disabled=${discardButtonDisabled}
      >
        Discard
      </button>
      ${isTargeting
        ? html`<div class="targeting-indicator">Select a target</div>`
        : ''}
    </div>
  `;
} 