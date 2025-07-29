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
  GAME_EVENT_SYSTEM,
  GAME_EVENT_DRAW,
  getCurrentPlayer,
  isAIPlayer,
  getCardFromHand,
  getPlayerById,
  type PlayerState,
} from './types';
import {
  createInitialGameState,
  type PlayerConfig,
  checkWinCondition,
  playCard,
  isCardPlayable,
  addGameEvent,
  advanceTurn,
  discardCard,
} from './engine/game';
import { createAIStrategy } from './engine/ai';
import { draw } from './engine/deck';
import { PLAYER_SELECTED_AS_TARGET_EVENT, renderPlayer } from './ui/player';
import { CARD_SELECTED_EVENT, HandView } from './ui/hand';
import { ControlsView, DISCARD_CARD_EVENT, PLAY_CARD_EVENT } from './ui/ControlsView';
import { LogView } from './ui/LogView';
import { DISCARD_CARD, PLAY_CARD } from './engine/strategies/IAIStrategy';

const UI_DELAY_MS = 1000;


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
    this.addLog(GAME_EVENT_SYSTEM, `Game started with ${playerCount} players.`);

    // Log if player count was set from URL, but only in a browser environment
    if (typeof window !== 'undefined' && window.location) {
        const params = new URLSearchParams(window.location.search);
        if (params.has('playerCount')) {
            this.addLog(GAME_EVENT_SYSTEM, `Player count set to ${playerCount} from URL parameter.`);
        }
    }

    this.attachEventListeners();
    this.render();
    this.gameLoop();
  }

  private addLog(type: GameEvent['type'], message: string) {
    this.state = addGameEvent(this.state, type, message);
  }

  private attachEventListeners() {
    document.addEventListener(CARD_SELECTED_EVENT, (e: Event) => {
      this.selectedCardId = (e as CustomEvent).detail.cardId;
      this.render();
    });

    document.addEventListener(PLAY_CARD_EVENT, this.handlePlayCardRequest.bind(this));
    document.addEventListener(DISCARD_CARD_EVENT, this.handleDiscardCardRequest.bind(this));
    document.addEventListener(PLAYER_SELECTED_AS_TARGET_EVENT, this.handleTargetSelected.bind(this));
    // We will attach the new game handler in the render method, as it's tied to a specific button
  }

  private handleNewGameRequest() {
    // Re-initialize the game state from the stored playerConfigs
    this.state = createInitialGameState(this.playerConfigs);
    this.addLog(GAME_EVENT_SYSTEM, `New game started with ${this.playerConfigs.length} players.`);
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
      this.addLog(GAME_EVENT_SYSTEM, `Player ${this.state.turnIndex + 1} is choosing a target for ${card.name}.`);
      this.render();
    } else {
      this.playCard(card);
      this.resolveHumanAction();
    }
  }

  private handleDiscardCardRequest() {
    if (!this.selectedCardId) return;
    this.state = discardCard(this.state, this.selectedCardId);
    this.resolveHumanAction();
  }

  private resolveHumanAction() {
    if (this.humanActionResolver) {
      this.humanActionResolver();
      this.humanActionResolver = null;
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
      this.resolveHumanAction();
    }
  }

  private playCard(card: Card, targetPlayerIndex?: number) {
    const targetPlayer = targetPlayerIndex !== undefined ? this.state.players[targetPlayerIndex] : undefined;
    this.state = playCard(this.state, card.id, targetPlayer?.id);
  }

  // --- Turn Management & Game Loop ---

  /**
   * Main game loop that manages the flow of turns for all players.
   *
   * This asynchronous function repeatedly performs the following steps:
   * 1. Retrieves the current player and draws a card for them.
   * 2. Determines if the current player is an AI or a human:
   *    - If AI, handles the AI's turn logic.
   *    - If human, waits for the human player's action.
   * 3. After the player's action, checks if there is a winner:
   *    - If a player has won, displays an alert and exits the loop.
   * 4. Advances the turn to the next player, logs the event, resets the selected card, and re-renders the UI.
   *
   * The loop continues until a winner is found.
   */
  private async gameLoop() {
    while (true) {
      const currentPlayer = getCurrentPlayer(this.state);
      this.drawCardForPlayer(currentPlayer);
      if (isAIPlayer(currentPlayer)) {
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
      
      this.state = advanceTurn(this.state);
      this.addLog(GAME_EVENT_SYSTEM, `It's now Player ${getCurrentPlayer(this.state).id}'s turn.`);
      this.selectedCardId = null;
      this.render();
    }
  }

  /**
   * Draws a card for the specified player and updates the game state accordingly.
   *
   * This function performs the following steps:
   * 1. Logs the action of drawing a card for the player.
   * 2. Draws one card from the deck using the `draw` function, which returns the drawn cards,
   *    the updated deck, and the updated discard pile.
   * 3. Updates the game state's deck and discard pile with the new values.
   * 4. Adds the drawn card(s) to the specified player's hand.
   * 5. Logs the number of cards the player had before and after drawing.
   * 6. Adds a game event log entry for the card draw.
   *
   * @param player - The PlayerState object representing the player who will draw a card.
   */
  private drawCardForPlayer(player: PlayerState) {
      console.log(`Drawing card for player ${player.id}`);
      const { drawn, newDeck, newDiscard } = draw(this.state.deck, this.state.discard, 1);
      this.state.deck = newDeck;
      this.state.discard = newDiscard;
      // this.state.players[this.state.turnIndex].hand.push(...drawn);
      console.log(`Player ${player.id} has ${player.hand.length} cards.`);
      player.hand.push(...drawn);
      this.addLog(GAME_EVENT_DRAW, `Player ${player.id} drew a card.`);
      console.log(`Player ${player.id} drew ${drawn.length} cards. It now has ${player.hand.length} cards.`);
  }

  private waitForHumanAction() {
    console.log('Waiting for human action...');
    return new Promise<void>(resolve => {
      console.log('Human action resolver set');
      this.humanActionResolver = resolve;
    });
  }


  // --- AI Turn Logic ---

  
  /**
   * Delays execution for a specified number of milliseconds.
   *
   * This function returns a Promise that resolves after the given time,
   * allowing asynchronous functions to pause execution for a set duration.
   *
   * @param ms - The number of milliseconds to delay.
   * @returns A Promise that resolves after the specified delay.
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Handles the turn logic for an AI player.
   *
   * This function performs the following steps:
   * 1. Sets the AI player's "thinking" state and renders the UI to indicate the AI is processing.
   * 2. Waits for a short delay to simulate thinking time.
   * 3. Uses the AI strategy assigned to the player to decide the next move (play or discard a card).
   * 4. Logs the AI's decision for debugging purposes.
   * 5. Updates the UI to reflect the selected card and removes the "thinking" state.
   * 6. Waits for another short delay to simulate the AI's action.
   * 7. Executes the chosen action:
   *    - If the action is to play a card, it checks if a target player is specified.
   *      - If so, highlights the target, waits, then plays the card on the target.
   *      - If not, plays the card on the AI player itself.
   *    - If the action is to discard a card, discards the specified card and waits.
   * 8. Throws an error if the AI tries to play a card not found in its hand.
   *
   * This function is asynchronous and should be awaited to ensure turn order is maintained.
   */
  private async handleAITurn() {
    const player = getCurrentPlayer(this.state);
    if (!player.aiStrategy) return; // Should not happen, but a good safeguard

    // 1. Set "Thinking" state
    player.isThinking = true;
    this.render();
    await this.delay(UI_DELAY_MS);

    // 2. Decide move
    const ai = createAIStrategy(player.aiStrategy);
    const action = ai.decideMove(player, this.state);
    
    // console.log(`AI ${player.id} has hand ${player.hand.map(c => c.name).join(', ')}`);
    console.log(`AI ${player.id} decided to ${action.type} card ${action.cardId} on target ${action.targetId}`);
    player.isThinking = false;
    this.selectedCardId = action.cardId;
    this.render();
    // console.log(`AI ${player.id} delayed for 1 second`);
    await this.delay(UI_DELAY_MS);
    // console.log(`AI ${player.id} continuing...`);

    // 3. Handle action
    if (action.type === PLAY_CARD) {
      const cardToPlay = getCardFromHand(player, action.cardId);
      if (cardToPlay) {
        if (action.targetId) {
          const targetPlayer = getPlayerById(this.state, action.targetId);
          if (targetPlayer) {
            targetPlayer.isTargeted = true;
            this.render();
            await this.delay(UI_DELAY_MS);
            targetPlayer.isTargeted = false;
            this.state = playCard(this.state, cardToPlay.id, targetPlayer.id);
          }
        } else { // no target specified - play on self
          this.state = playCard(this.state, cardToPlay.id);
        }
      }
      else {
        throw new Error(`AI ${player.id} tried to play card ${action.cardId} but it was not found in their hand`);
      }
    } else if (action.type === DISCARD_CARD) {
      this.state = discardCard(this.state, action.cardId)
      this.render();
      await this.delay(UI_DELAY_MS); 
    }
  }


  private render() {
    const currentPlayer = getCurrentPlayer(this.state);
    const isTargeting = this.state.actionState ? true : false;

    const selectedCard = this.selectedCardId ? currentPlayer.hand.find(c => c.id === this.selectedCardId) : null;
    const canPlay = selectedCard ? isCardPlayable(selectedCard, this.state) : false;

    const template = html`
      <div class="app-container">
        <div class="top-section">
          <div class="board">
            ${this.state.players.map((player, index) => {
              const isCurrentPlayer = player.id === currentPlayer.id;
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