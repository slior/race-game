/**
 * @file This file implements the core game logic for the RACE card game.
 * It contains pure functions for managing player state, turn progression,
 * and game initialization, adhering to a stateless, immutable architecture.
 */

import { createDeck, shuffle, draw } from './deck';
import {
  type GameState,
  type Card,
  type PlayerState,
  BLOCK_TYPE,
  REMEDY_TYPE,
  IMMUNITY_TYPE,
  PROGRESS_TYPE,
  GREEN_LIGHT_NAME,
  isImmuneTo,
} from '../types';

const DEFAULT_INITIAL_HAND_SIZE = 5;

/**
 * Creates a new player state object.
 * @param initialHand - The initial set of cards for the player.
 * @returns A new PlayerState object.
 */
export const createPlayer = (id: string, initialHand: Card[]): PlayerState => {
  return {
    id,
    hand: initialHand,
    inPlay: {
      progress: [],
      blocks: [],
      immunities: [],
    },
    totalKm: 0,
  };
};

/**
 * Applies the effect of a played card to a player's state.
 * This function is a pure function that returns a new state object.
 * @param player - The current state of the player.
 * @param card - The card to apply.
 * @returns A new PlayerState object with the card's effect applied.
 */
export const applyCardToPlayer = (
  player: PlayerState,
  card: Card
): PlayerState => {
  const newPlayerState = JSON.parse(JSON.stringify(player));

  switch (card.type) {
    case PROGRESS_TYPE:
      // A player must have a green light to play a progress card.
      if (
        !newPlayerState.inPlay.progress.find(
          (c: Card) => c.name === GREEN_LIGHT_NAME
        )
      ) {
        return newPlayerState; // No change if no green light
      }
      if (card.value) {
        newPlayerState.totalKm += card.value;
        newPlayerState.inPlay.progress.push(card);
      }
      break;
    case BLOCK_TYPE:
      if (!isImmuneTo(player, card)) {
        newPlayerState.inPlay.blocks.push(card);
      }
      break;
    case REMEDY_TYPE:
      // The "Green Light" card is special; it's a prerequisite for progress.
      if (card.name === GREEN_LIGHT_NAME) {
        newPlayerState.inPlay.progress.push(card);
      }
      // Find and remove the corresponding block
      newPlayerState.inPlay.blocks = newPlayerState.inPlay.blocks.filter(
        (block: Card) => block.blocksType !== card.remediesType
      );
      break;
    case IMMUNITY_TYPE:
      newPlayerState.inPlay.immunities.push(card);
      break;
  }
  return newPlayerState;
};

/**
 * Advances the turn to the next player.
 * @param currentState - The current state of the game.
 * @returns A new GameState object with the turn index updated.
 */
export const advanceTurn = (currentState: GameState): GameState => {
  const newTurnIndex = (currentState.turnIndex + 1) % currentState.players.length;
  return {
    ...currentState,
    turnIndex: newTurnIndex,
  };
};

/**
 * Checks if any player has met the win condition (>= 1000 km).
 * @param currentState - The current state of the game.
 * @returns The winning PlayerState object, or null if no one has won.
 */
export const checkWinCondition = (
  currentState: GameState
): PlayerState | null => {
  for (const player of currentState.players) {
    if (player.totalKm >= 1000) {
      return player;
    }
  }
  return null;
};

/**
 * Creates the initial state for a new game.
 * @param playerCount - The number of players in the game (2-4).
 * @param initialHandSize - The number of cards to deal to each player.
 * @returns A complete GameState object for the start of a game.
 */
export const createInitialGameState = (
  playerCount: number,
  initialHandSize = DEFAULT_INITIAL_HAND_SIZE
): GameState => {
  const initialDeck = createDeck();
  const shuffledDeck = shuffle(initialDeck);

  const players: PlayerState[] = [];
  let workingDeck = [...shuffledDeck];
  let workingDiscard: Card[] = [];

  for (let i = 0; i < playerCount; i++) {
    const {
      drawn,
      newDeck,
      newDiscard,
    } = draw(workingDeck, workingDiscard, initialHandSize);
    workingDeck = newDeck;
    workingDiscard = newDiscard;
    players.push(createPlayer(`player-${i}`, drawn));
  }

  return {
    deck: workingDeck,
    discard: workingDiscard,
    players,
    turnIndex: 0,
    actionState: null,
    events: [],
  };
};
