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
//   type PlayerState,
} from './types';
import {
  createInitialGameState,
  type PlayerConfig,
  advanceTurn,
  checkWinCondition,
  playCard,
} from './engine/game';
import { createAIStrategy } from './engine/ai';
import { draw } from './engine/deck';
import { renderPlayer } from './ui/player';
import { HandView } from './ui/hand';
import { ControlsView } from './ui/ControlsView';
import { LogView } from './ui/LogView';

class App {
  private state: GameState;
  private selectedCardId: string | null = null;
  private rootElement: HTMLElement;
  private playerConfigs: PlayerConfig[];
  private humanActionResolver: ((value: void | PromiseLike<void>) => void) | null = null;

    /**
     * Checks if the provided player count is within the valid range (2-4).
     * @param playerCount - The number of players to validate.
     * @returns True if playerCount is between 2 and 4 (inclusive), otherwise false.
     */
    static isValidPlayerCount(playerCount: number): boolean {
        return playerCount >= 2 && playerCount <= 4;
    }

  constructor(rootElement: HTMLElement, playerCount: number) {
    this.rootElement = rootElement;

    this.playerConfigs = Array.from({ length: playerCount }, () => ({
      aiStrategy: null,
    }));
    
    this.state = createInitialGameState(this.playerConfigs);
    this.state.events = [];
    // this.addLog('system', `Game started with ${playerCount} players.`);

    // Log if player count was set from URL, but only in a browser environment
    if (typeof window !== 'undefined' && window.location) {
        const params = new URLSearchParams(window.location.search);
        if (params.has('playerCount')) {
            // this.addLog('system', `Player count set to ${playerCount} from URL parameter.`);
        }
    }

    this.attachEventListeners();
    this.render();
    this.gameLoop();
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
    // Re-initialize the game state from the stored playerConfigs
    this.state = createInitialGameState(this.playerConfigs);
    // this.addLog('system', `New game started with ${this.playerConfigs.length} players.`);
    this.selectedCardId = null;
    this.render();
    this.gameLoop();
  }

  private handlePlayerCountChange(newCount: number) {
    if (!App.isValidPlayerCount(newCount)) return;

    // Preserve existing configs, add new ones, or trim old ones
    const currentCount = this.playerConfigs.length;
    if (newCount > currentCount) {
      for (let i = currentCount; i < newCount; i++) {
        this.playerConfigs.push({ aiStrategy: null });
      }
    } else {
      this.playerConfigs.length = newCount;
    }
    this.render();
  }

  private handleAIStrategyChange(playerIndex: number, strategy: string | null) {
    this.playerConfigs[playerIndex].aiStrategy = strategy;
    // No re-render here, as the config is latent until a new game starts.
  }

  private handlePlayCardRequest() {
    if (!this.selectedCardId) return;

    const currentPlayer = this.state.players[this.state.turnIndex];
    const card = currentPlayer.hand.find(c => c.id === this.selectedCardId);

    if (!card) return;

    if (card.type === BLOCK_TYPE) {
      this.state.actionState = {
        // type: 'awaiting-target',
        cardId: card.id,
      };
      // this.addLog('system', `Player ${this.state.turnIndex + 1} is choosing a target for ${card.name}.`);
      this.render();
    } else {
      this.playCard(card);
      if (this.humanActionResolver) {
        this.humanActionResolver();
        this.humanActionResolver = null;
      }
    }
  }

  private handleDiscardCardRequest() {
    if (!this.selectedCardId) return;
    const player = this.state.players[this.state.turnIndex];
    const cardIndex = player.hand.findIndex(c => c.id === this.selectedCardId);

    if (cardIndex > -1) {
      const [discardedCard] = player.hand.splice(cardIndex, 1);
      this.state.discard.push(discardedCard);
      // this.addLog('discard', `Player ${this.state.turnIndex + 1} discarded ${discardedCard.name}.`);
      
      if (this.humanActionResolver) {
        this.humanActionResolver();
        this.humanActionResolver = null;
      }
    }
    else {
      // throw new Error(`Discard card request not handled: could not find card ${this.selectedCardId} in player ${this.state.turnIndex+1}'s hand`);
      console.error(`Discard card request not handled: could not find card ${this.selectedCardId} in player ${this.state.turnIndex+1}'s hand`);
    }
  }

  private handleTargetSelected(e: Event) {
    if (!this.state.actionState) return;

    const { playerIndex: targetPlayerIndex } = (e as CustomEvent).detail;
    const cardId = this.state.actionState.cardId;
    const player = this.state.players[this.state.turnIndex];
    const card = player.hand.find(c => c.id === cardId);

    if (card) {
      // Set the targetId in the actionState before playing the card
      this.state.actionState.targetId = this.state.players[targetPlayerIndex].id;
      // The playCard method will now handle the state update
      this.playCard(card, targetPlayerIndex);
      if (this.humanActionResolver) {
        this.humanActionResolver();
        this.humanActionResolver = null;
      }
    }
  }

  private playCard(card: Card, targetPlayerIndex?: number) {
    const targetPlayer = targetPlayerIndex !== undefined ? this.state.players[targetPlayerIndex] : undefined;
    this.state = playCard(this.state, card.id, targetPlayer?.id);
  }

  // --- Turn Management & Game Loop ---

  private async gameLoop() {
    while (true) {
      const currentPlayer = this.state.players[this.state.turnIndex];
      if (currentPlayer.aiStrategy) {
        await this.handleAITurn();
      } else {
        await this.waitForHumanAction();
      }

      // After action, check for winner
      const winner = checkWinCondition(this.state);
      if (winner) {
        alert(`Player ${this.state.players.indexOf(winner) + 1} wins!`);
        break; // End the loop
      }

      // Draw card and advance to next turn
      const { drawn, newDeck, newDiscard } = draw(this.state.deck, this.state.discard, 1);
      this.state.deck = newDeck;
      this.state.discard = newDiscard;
      this.state.players[this.state.turnIndex].hand.push(...drawn);
      // this.addLog('draw', `Player ${this.state.turnIndex + 1} drew a card.`);
      console.log(`Player ${this.state.turnIndex + 1} drew a card. It now has ${this.state.players[this.state.turnIndex].hand.length} cards.`);
      
      this.state = advanceTurn(this.state);
      // this.addLog('system', `It's now Player ${this.state.turnIndex + 1}'s turn.`);
      this.selectedCardId = null;
      this.render();
    }
  }

  private waitForHumanAction() {
    return new Promise<void>(resolve => {
      this.humanActionResolver = resolve;
    });
  }


  // --- AI Turn Logic ---

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async handleAITurn() {
    const player = this.state.players[this.state.turnIndex];
    if (!player.aiStrategy) return; // Should not happen, but a good safeguard

    // 1. Set "Thinking" state
    player.isThinking = true;
    this.render();
    await this.delay(1000);

    // 2. Decide move
    const ai = createAIStrategy(player.aiStrategy);
    const action = ai.decideMove(player, this.state);
    
    // console.log(`AI ${player.id} has hand ${player.hand.map(c => c.name).join(', ')}`);
    console.log(`AI ${player.id} decided to ${action.type} card ${action.cardId} on target ${action.targetId}`);
    player.isThinking = false;
    this.selectedCardId = action.cardId;
    this.render();
    await this.delay(1000);

    // 3. Handle action
    if (action.type === 'PLAY_CARD') {
      const cardToPlay = player.hand.find(c => c.id === action.cardId);
      if (cardToPlay) {
        if (action.targetId) {
          const targetPlayerIndex = this.state.players.findIndex(p => p.id === action.targetId);
          if (targetPlayerIndex !== -1) {
            this.state.players[targetPlayerIndex].isTargeted = true;
            this.render();
            await this.delay(1000);
            this.state.players[targetPlayerIndex].isTargeted = false;
            const targetPlayer = this.state.players[targetPlayerIndex];
            this.state = playCard(this.state, cardToPlay.id, targetPlayer.id);
          }
        } else {
          this.state = playCard(this.state, cardToPlay.id);
        }
      }
    } else if (action.type === 'DISCARD_CARD') {
      this.handleDiscardCardRequest(); // Re-uses the existing discard logic
    }
  }


  private render() {
    const currentPlayer = this.state.players[this.state.turnIndex];
    const isTargeting = this.state.actionState ? true : false;

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
              <h4>Game Setup</h4>
              <div class="player-count-selector">
                <label for="player-count-input">Number of Players:</label>
                <input
                  type="number"
                  id="player-count-input"
                  min="2"
                  max="4"
                  .value=${this.playerConfigs.length.toString()}
                  @change=${(e: Event) => this.handlePlayerCountChange(parseInt((e.target as HTMLInputElement).value))}
                />
              </div>

              <div class="player-configs">
                ${this.playerConfigs.map(
                  (config, index) => html`
                    <div class="player-config">
                      <label>Player ${index + 1}</label>
                      <select @change=${(e: Event) => this.handleAIStrategyChange(index, (e.target as HTMLSelectElement).value === 'null' ? null : (e.target as HTMLSelectElement).value)}>
                        <option value="null" ?selected=${config.aiStrategy === null}>Human</option>
                        <option value="Heuristic" ?selected=${config.aiStrategy === 'Heuristic'}>AI: Heuristic</option>
                        <option value="Aggressor" ?selected=${config.aiStrategy === 'Aggressor'}>AI: Aggressor</option>
                      </select>
                    </div>
                  `
                )}
              </div>

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
                isAITurnInProgress: false, // This flag is no longer needed
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