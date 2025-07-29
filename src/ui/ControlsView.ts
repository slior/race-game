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

export const DISCARD_CARD_EVENT = 'discard-card-requested';
export const PLAY_CARD_EVENT = 'play-card-requested';

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
    document.dispatchEvent(new CustomEvent(PLAY_CARD_EVENT));
  const onDiscard = () =>
    document.dispatchEvent(new CustomEvent(DISCARD_CARD_EVENT));

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