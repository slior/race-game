/**
 * @file This file implements the core game logic for the RACE card game.
 * It contains pure functions for managing player state, turn progression,
 * and game initialization, adhering to a stateless, immutable architecture.
 */

import {
  type Card,
  type GameState,
  type PlayerState,
  type GameEvent,
  isBlocked,
  hasGreenLight,
  BLOCK_TYPE,
  REMEDY_TYPE,
  IMMUNITY_TYPE,
  PROGRESS_TYPE,
  BLOCK_STOP_TYPE,
  isCardPlayable,
  getCurrentPlayer,
  getCardFromHand,
  getPlayerById,
  getPlayerIndex,
  type BlockType,
  isGreenLight,
} from '../types';
import { createDeck, draw, shuffle } from './deck';

/**
 * Configuration for a player.
 */
export interface PlayerConfig {
  aiStrategy: string | null;
}


function remedy(blocks: Card[], remediesType: BlockType): Card[] {
  return blocks.filter(b => b.blocksType !== remediesType);
}

/**
 * Applies the effect of a played card to a player's state.
 * This function is a pure function that returns a new state object.
 * @param player - The current state of the player.
 * @param card - The card to apply.
 * @returns A new PlayerState object with the card's effect applied.
 */
export function applyCardToPlayer(player: PlayerState, card: Card): PlayerState {
  const newPlayerState = {
    ...player,
    inPlay: {
      progress: [...player.inPlay.progress],
      blocks: [...player.inPlay.blocks],
      immunities: [...player.inPlay.immunities],
    },
  };

  switch (card.type) {
    case PROGRESS_TYPE:
      // A player must have a green light and not be blocked to play a progress card.
      if (!hasGreenLight(player) || isBlocked(player)) {
        return newPlayerState; // No change
      }
      newPlayerState.inPlay.progress.push(card);
      if (card.value) {
        newPlayerState.totalKm += card.value;
      }
      else throw new Error('Invalid state: progress card has no value');
      break;
    case REMEDY_TYPE:
      if (isGreenLight(card)) {
        // A green light is a prerequisite for progress, but also removes a "Stop" block.
        newPlayerState.inPlay.progress.push(card);
        newPlayerState.inPlay.blocks = remedy(newPlayerState.inPlay.blocks, BLOCK_STOP_TYPE);
      } else {
        // Any other remedy card removes the corresponding block.
        newPlayerState.inPlay.blocks = remedy(newPlayerState.inPlay.blocks, card.remediesType!);
      }
      break;
    case BLOCK_TYPE:
      newPlayerState.inPlay.blocks.push(card);
      break;
    case IMMUNITY_TYPE:
      newPlayerState.inPlay.immunities.push(card);
      break;
  }

  // Update isReady status
  newPlayerState.isReady =
    hasGreenLight(newPlayerState) && !isBlocked(newPlayerState);

  return newPlayerState;
}

/**
 * Adds a new event to the game log.
 * @param gameState The current state of the game.
 * @param type The type of the event.
 * @param message The event message.
 * @returns A new GameState object with the event added.
 */
function addGameEvent(gameState: GameState, type: GameEvent['type'], message: string): GameState {
    const newEvents = [{ type, message }, ...gameState.events];
    if (newEvents.length > 50) {
      newEvents.pop();
    }
    return {
        ...gameState,
        events: newEvents,
    };
}

/**
 * Processes the playing of a card, updating the game state.
 * This is a pure function that returns a new state object.
 * @param gameState The current state of the game.
 * @param cardId The ID of the card to play.
 * @param targetPlayerId The ID of the target player (for block cards).
 * @returns A new GameState object reflecting the move.
 */
export function playCard(gameState: GameState, cardId: string, targetPlayerId?: string): GameState {
   
    const card = getCardFromHand(getCurrentPlayer(gameState), cardId);
    if (!card) return gameState; // Card not found, return original state
    
    let newState = {
        ...gameState,
        players: gameState.players.map(p => ({...p})),
        discard: [...gameState.discard],
    };
    
    const player = getCurrentPlayer(newState);
    let logMessage: string;
    newState.discard.push(card); // Add card to discard pile
    if (!isCardPlayable(card,gameState)) 
    {
        logMessage = `Player ${player.id} tried to play ${card.name} but it was not playable.`;
    }
    else
    {  
      player.hand = player.hand.filter(c => c.id !== card.id); // Remove card from hand

      const targetPlayer = targetPlayerId ? getPlayerById(newState, targetPlayerId) : player;
      
      if (!targetPlayer) throw new Error('Target player not found');

      const newTargetPlayer = applyCardToPlayer(targetPlayer, card);
      newState.players = newState.players.map(p => p.id === newTargetPlayer.id ? newTargetPlayer : p); // update target player

      newState = advanceTurn(newState);

      
      logMessage = (targetPlayerId && targetPlayerId !== player.id) ?
            `Player ${player.id} played ${card.name} on Player ${getPlayerIndex(targetPlayer, newState) + 1}.` :
            `Player ${player.id} played ${card.name}.`;
      
      
    } //end else - card was playable
    
    newState = addGameEvent(newState, 'play', logMessage);
    newState.actionState = null; // Reset action state
    return newState;
}


/**
 * Advances the game to the next turn.
 * @param gameState - The current state of the game.
 * @returns A new GameState object with the turn index updated.
 */
export function advanceTurn(gameState: GameState): GameState {
  const newTurnIndex = (gameState.turnIndex + 1) % gameState.players.length;
  return {
    ...gameState,
    turnIndex: newTurnIndex,
  };
}

export const TARGET_DISTANCE = 1000;

/**
 * Checks if a player has won the game.
 * @param gameState The current state of the game.
 * @returns The winning PlayerState or null if no winner yet.
 */
export function checkWinCondition(gameState: GameState): PlayerState | null {
  
  return gameState.players.find((p) => p.totalKm >= TARGET_DISTANCE) || null;
}

/**
 * Creates the initial state for a new game.
 *
 * This function initializes the deck, shuffles it, deals cards to players,
 * and sets up the initial game state object.
 *
 * @param playerConfigs - An array of player configurations.
 * @returns The initial GameState object.
 */
export function createInitialGameState(
  playerConfigs: PlayerConfig[]
): GameState {

  if (playerConfigs.length < 2 || playerConfigs.length > 4) {
    throw new Error('Player count must be between 2 and 4');
  }

  let deck = shuffle(createDeck());

  // Draw initial hands
  const hands = Array.from({ length: playerConfigs.length }, () => {
    const { drawn, newDeck } = draw(deck, [], 5);
    deck = newDeck;
    return drawn;
  });

  const players: PlayerState[] = playerConfigs.map((config, index) => ({
    id: `player-${index}`,
    hand: hands[index],
    inPlay: { progress: [], blocks: [], immunities: [] },
    totalKm: 0,
    isReady: false, // will be updated after creation
    aiStrategy: config.aiStrategy,
    isThinking: false,
    isTargeted: false,
  }));

  // Update isReady state for all players
  players.forEach(p => {
    p.isReady = hasGreenLight(p) && !isBlocked(p);
  });

  return {
    deck,
    discard: [],
    players,
    turnIndex: 0,
    actionState: null,
    events: [],
  };
}
