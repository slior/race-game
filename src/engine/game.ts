/**
 * @file This file implements the core game logic for the RACE card game.
 * It contains pure functions for managing player state, turn progression,
 * and game initialization, adhering to a stateless, immutable architecture.
 */

import type { GameState, PlayerState, Card } from '../types';
import { createDeck, shuffle, draw } from './deck';

/**
 * Creates a new player state object.
 * @param initialHand - The initial set of cards for the player.
 * @returns A new PlayerState object.
 */
export const createPlayer = (initialHand: Card[]): PlayerState => {
  return {
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
    case 'Progress':
      if (card.value) {
        newPlayerState.totalKm += card.value;
        newPlayerState.inPlay.progress.push(card);
      }
      break;
    case 'Block':
      newPlayerState.inPlay.blocks.push(card);
      break;
    case 'Remedy':
      // Find and remove the corresponding block
      newPlayerState.inPlay.blocks = newPlayerState.inPlay.blocks.filter(
        (block: Card) => block.blocksType !== card.remediesType
      );
      break;
    case 'Immunity':
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
  initialHandSize = 5
): GameState => {
  // createDeck() returns a fresh, ordered deck of cards.
  const initialDeck = createDeck();
  // shuffle() returns a new, shuffled array of cards.
  const shuffledDeck = shuffle(initialDeck);

  const players: PlayerState[] = [];
  let workingDeck = [...shuffledDeck];
  let workingDiscard: Card[] = [];

  for (let i = 0; i < playerCount; i++) {
    // draw() returns { drawn, newDeck, newDiscard }
    const {
      drawn,
      newDeck,
      newDiscard,
    } = draw(workingDeck, workingDiscard, initialHandSize);
    workingDeck = newDeck;
    workingDiscard = newDiscard;
    players.push(createPlayer(drawn));
  }

  return {
    deck: workingDeck,
    discard: workingDiscard,
    players,
    turnIndex: 0,
  };
};
