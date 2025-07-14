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
import { renderPlayer } from './ui/player';
import { HandView } from './ui/hand';
import { ControlsView } from './ui/ControlsView';
import { LogView } from './ui/LogView';

class App {
  private state: GameState;
  private selectedCardId: string | null = null;
  private rootElement: HTMLElement;
//   private initialPlayerCount: number;

  constructor(rootElement: HTMLElement, playerCount: number) {
    this.rootElement = rootElement;
    // this.initialPlayerCount = playerCount;
    this.state = createInitialGameState(playerCount);
    this.state.events = [];
    this.addLog('system', `Game started with ${playerCount} players.`);

    // Log if player count was set from URL
    const params = new URLSearchParams(window.location.search);
    if (params.has('playerCount')) {
      this.addLog('system', `Player count set to ${playerCount} from URL parameter.`);
    }

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
    // We will attach the new game handler in the render method, as it's tied to a specific button
  }

  private handleNewGameRequest() {
    const playerCountInput = this.rootElement.querySelector('#player-count-input') as HTMLInputElement;
    if (!playerCountInput) return;

    const newPlayerCount = parseInt(playerCountInput.value, 10);
    if (isNaN(newPlayerCount) || newPlayerCount < 2 || newPlayerCount > 4) {
      alert('Invalid number of players. Please enter a number between 2 and 4.');
      return;
    }

    // Warn user if a game is in progress (more than just the initial system messages)
    if (this.state.events.length > 2) {
      const confirmed = window.confirm('Are you sure you want to start a new game? Your current progress will be lost.');
      if (!confirmed) {
        return;
      }
    }

    // Re-initialize the game state
    this.state = createInitialGameState(newPlayerCount);
    this.addLog('system', `New game started with ${newPlayerCount} players.`);
    this.selectedCardId = null;
    this.render();
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
          <div class="board">
            ${this.state.players.map((player, index) => {
              const isCurrentPlayer = this.state.turnIndex === index;
              const isTargetable =
                isTargeting &&
                player.id !== currentPlayer.id;

              return html`
                <div class="player-area">
                  ${renderPlayer(player, index, isTargetable, isCurrentPlayer)}
                  ${isCurrentPlayer
                    ? HandView(currentPlayer.hand, this.selectedCardId)
                    : ''}
                </div>
              `;
            })}
          </div>
        </div>
        <div class="bottom-section">
          <div class="left-pane">
            <div class="game-settings">
              <label for="player-count-input">Number of Players:</label>
              <input
                type="number"
                id="player-count-input"
                min="2"
                max="4"
                .value=${this.state.players.length.toString()}
              />
              <button @click=${() => this.handleNewGameRequest()}>
                Start New Game
              </button>
            </div>
            ${LogView(this.state.events)}
          </div>
          <div class="right-pane">
            <div class="hand-and-controls">
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