/*
 * src/app.ts
 *
 * This file contains the main application component. It is responsible for
 * orchestrating the entire UI, managing the central game state, and handling
 * all user interactions. It assembles the various UI views (Board, Hand,
 * Controls, Log) and connects them to the game engine.
 */
import { render, html } from 'lit-html';
import {
  type GameState,
  type Card,
  BLOCK_TYPE,
  type GameEvent,
  isCardPlayable,
} from './types';
import { createInitialGameState, applyCardToPlayer, advanceTurn, checkWinCondition } from './engine/game';
import { draw } from './engine/deck';
import { renderBoard } from './ui/board';
import { HandView } from './ui/hand';
import { ControlsView } from './ui/ControlsView';
import { LogView } from './ui/LogView';

class App {
  private state: GameState;
  private selectedCardId: string | null = null;
  private rootElement: HTMLElement;

  constructor(rootElement: HTMLElement, playerCount: number) {
    this.rootElement = rootElement;
    this.state = createInitialGameState(playerCount);
    this.state.events = [];
    this.addLog('system', `Game started with ${playerCount} players.`);
    this.attachEventListeners();
    this.render();
  }

  private attachEventListeners() {
    document.addEventListener('card-selected', (e: Event) => {
      this.selectedCardId = (e as CustomEvent).detail.cardId;
      this.render();
    });

    document.addEventListener('play-card-requested', this.handlePlayCardRequest.bind(this));
    document.addEventListener('discard-card-requested', this.handleDiscardCardRequest.bind(this));
    document.addEventListener('player-selected-as-target', this.handleTargetSelected.bind(this));
  }

  private handlePlayCardRequest() {
    if (!this.selectedCardId) return;

    const currentPlayer = this.state.players[this.state.turnIndex];
    const card = currentPlayer.hand.find(c => c.id === this.selectedCardId);

    if (!card) return;

    if (card.type === BLOCK_TYPE) {
      this.state.actionState = {
        type: 'awaiting-target',
        cardId: card.id,
      };
      this.addLog('system', `Player ${this.state.turnIndex + 1} is choosing a target for ${card.name}.`);
      this.render();
    } else {
      this.playCard(card);
    }
  }

  private handleDiscardCardRequest() {
    if (!this.selectedCardId) return;
    const player = this.state.players[this.state.turnIndex];
    const cardIndex = player.hand.findIndex(c => c.id === this.selectedCardId);

    if (cardIndex > -1) {
      const [discardedCard] = player.hand.splice(cardIndex, 1);
      this.state.discard.push(discardedCard);
      this.addLog('discard', `Player ${this.state.turnIndex + 1} discarded ${discardedCard.name}.`);
      this.endTurn();
    }
  }

  private handleTargetSelected(e: Event) {
    if (this.state.actionState?.type !== 'awaiting-target') return;

    const { playerIndex: targetPlayerIndex } = (e as CustomEvent).detail;
    const cardId = this.state.actionState.cardId;
    const card = this.state.players[this.state.turnIndex].hand.find(c => c.id === cardId);

    if (card) {
      // Set the targetId in the actionState before playing the card
      this.state.actionState.targetId = this.state.players[targetPlayerIndex].id;
      this.playCard(card, targetPlayerIndex);
    }
  }

  private playCard(card: Card, targetPlayerIndex?: number) {
    const currentPlayerIndex = this.state.turnIndex;
    const player = this.state.players[currentPlayerIndex];

    // Remove card from hand
    player.hand = player.hand.filter(c => c.id !== card.id);

    const targetPlayer =
      targetPlayerIndex !== undefined
        ? this.state.players[targetPlayerIndex]
        : player;

    const newTargetState = applyCardToPlayer(targetPlayer, card);

    if (targetPlayerIndex !== undefined) {
      this.state.players[targetPlayerIndex] = newTargetState;
      this.addLog('play', `Player ${currentPlayerIndex + 1} played ${card.name} on Player ${targetPlayerIndex + 1}.`);
    } else {
      this.state.players[currentPlayerIndex] = newTargetState;
      this.addLog('play', `Player ${currentPlayerIndex + 1} played ${card.name}.`);
    }

    this.state.discard.push(card);
    this.state.actionState = null;
    this.endTurn();
  }

  private endTurn() {
    // Draw a new card
    const { drawn, newDeck, newDiscard } = draw(this.state.deck, this.state.discard, 1);
    this.state.deck = newDeck;
    this.state.discard = newDiscard;
    this.state.players[this.state.turnIndex].hand.push(...drawn);
    this.addLog('draw', `Player ${this.state.turnIndex + 1} drew a card.`);

    // Check for winner
    const winner = checkWinCondition(this.state);
    if (winner) {
      alert(`Player ${this.state.players.indexOf(winner) + 1} wins!`);
      // A real app would have a better win screen
      return;
    }

    // Advance to next turn
    this.state = advanceTurn(this.state);
    this.addLog('system', `It's now Player ${this.state.turnIndex + 1}'s turn.`);
    this.selectedCardId = null;
    this.render();
  }

  private addLog(type: GameEvent['type'], message: string) {
    this.state.events.unshift({ type, message });
    if (this.state.events.length > 50) {
      this.state.events.pop();
    }
  }

  private render() {
    const currentPlayer = this.state.players[this.state.turnIndex];
    const isTargeting = this.state.actionState?.type === 'awaiting-target';

    const selectedCard = this.selectedCardId ? currentPlayer.hand.find(c => c.id === this.selectedCardId) : null;
    const canPlay = selectedCard ? isCardPlayable(selectedCard, this.state) : false;

    const template = html`
      <div class="app-container">
        <div class="top-section">
          ${renderBoard(
            this.state.players,
            this.state.turnIndex,
            this.state.actionState
          )}
        </div>
        <div class="bottom-section">
          <div class="left-pane">
            ${LogView(this.state.events)}
          </div>
          <div class="right-pane">
            <div class="hand-and-controls">
              ${HandView(currentPlayer.hand, this.selectedCardId)}
              ${ControlsView({
                selectedCardId: this.selectedCardId,
                isTargeting,
                canPlay,
              })}
            </div>
          </div>
        </div>
      </div>
    `;
    render(template, this.rootElement);
  }
}

export default App; 