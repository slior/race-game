import {
  type PlayerState, type GameState,
  getRemedyCardForBlock, isBlocked, getHighestProgressCard, BLOCK_TYPE, IMMUNITY_TYPE,
  hasProgress,
  GREEN_LIGHT_NAME,
  getPlayersOpponents,
  getLeader,
  hasImmunity,
  type Card,
} from '../../types';
import {
  type IAIStrategy,
  type GameAction,
  PLAY_CARD,
  DISCARD_CARD,
  newGameAction,
} from './IAIStrategy';
import { isImmuneTo } from '../game';

/**
 * HeuristicStrategy is an AI strategy for deciding moves in the game using a simple set of prioritized rules.
 *
 * The strategy follows this decision order:
 * 1. If the AI player is blocked, play a remedy card to remove the block if possible.
 * 2. If not blocked, attempt to make progress by playing the highest value progress card,
 *    or play a Green Light card if no progress has been made yet.
 * 3. If unable to move, attempt to block the leading opponent by playing a block card on them,
 *    provided they are not immune to the block.
 * 4. If possible, play an immunity card that the player does not already have.
 * 5. If no other action is possible, discard the first card in hand.
 *
 * This strategy is intended to provide a reasonable, human-like AI opponent by following
 * common-sense priorities in gameplay.
 */
export class HeuristicStrategy implements IAIStrategy {
  /**
   * Decides the next move for the AI player based on the current game state.
   *
   * @param aiPlayer - The PlayerState representing the AI player.
   * @param gameState - The current GameState of the game.
   * @returns A GameAction representing the chosen move.
   */
  public decideMove(aiPlayer: PlayerState, gameState: GameState): GameAction {
    // 1. If blocked, play remedy
    if (isBlocked(aiPlayer)) {
      const remedy = getRemedyForBlock(aiPlayer);
      if (remedy) {
        return newGameAction(PLAY_CARD, remedy.id);
      }
    }
    else // 2. player is not blocked - make progress or play green light
    {
      const progressOrGreenLight = makeProgressOrPlayGreenLight(aiPlayer);
      if (progressOrGreenLight) {
        return progressOrGreenLight;
      }
    }

    // 3. Block lead opponent
    const opponents = getPlayersOpponents(aiPlayer, gameState);
    if (opponents.length === 0) {
      throw new Error('Invalid state: no opponents found');
    }
    else {
      const blockAction = tryBlockingOpponent(aiPlayer, getLeader(opponents));
      if (blockAction) {
        return blockAction;
      }
    }

    // 4. Play immunity if possible
    const immunityAction = tryPlayingImmunity(aiPlayer);
    if (immunityAction) {
      return immunityAction;
    }

    // 5. Discard
    return newGameAction(DISCARD_CARD, aiPlayer.hand[0].id);
  }
} //end of class HeuristicStrategy

function getRemedyForBlock(aiPlayer: PlayerState): Card | null {
  const block = aiPlayer.inPlay.blocks[0];
  const remedy = getRemedyCardForBlock(aiPlayer, block);
  return remedy;
}

function makeProgressOrPlayGreenLight(aiPlayer: PlayerState): GameAction | null {
  // Special rule: must play green light to start progress
  const hasMadeProgress = hasProgress(aiPlayer);
  const greenLight = aiPlayer.hand.find(
    (card) => card.name === GREEN_LIGHT_NAME
  );
  if (!hasMadeProgress && greenLight) {
    return newGameAction(PLAY_CARD, greenLight.id);
  }
  else if(hasMadeProgress) { //made progress, so play highest progress card
    const highestCard = getHighestProgressCard(aiPlayer);
    if (highestCard) {
      return newGameAction(PLAY_CARD, highestCard.id);
    }
  }
  else {
    console.log(`AI ${aiPlayer.id} has not made progress, and no green light card found`);
  }
  return null;
}

function tryBlockingOpponent(player: PlayerState, otherPlayer: PlayerState): GameAction | null {
  const blockCard = player.hand.find( //TODO: this finds the *1st* block card in hand. but it's possible to have multiple block cards in hand.
    (card) => card.type === BLOCK_TYPE
  );
  if (blockCard && !isImmuneTo(otherPlayer, blockCard)) {
    return newGameAction(PLAY_CARD, blockCard.id, otherPlayer.id);
  }
  return null;
}

function tryPlayingImmunity(player: PlayerState): GameAction | null {
  const immunityCard = player.hand.find( //TODO: this finds the *1st* immunity card in hand. but it's possible to have multiple immunity cards in hand.
    (card) => card.type === IMMUNITY_TYPE
  );
  if (immunityCard && immunityCard.remediesType) {
    if (!hasImmunity(player, immunityCard.remediesType)) {
      return newGameAction(PLAY_CARD, immunityCard.id);
    }
  }
  return null;
}