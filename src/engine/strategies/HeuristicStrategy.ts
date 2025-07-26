import {
  type PlayerState, type GameState,
  getRemedyCardForBlock, isBlocked, getHighestProgressCard, isImmuneTo, BLOCK_TYPE, IMMUNITY_TYPE,
  hasProgress,
  GREEN_LIGHT_NAME,
  getPlayersOpponents,
  getLeader,
  hasImmunity
} from '../../types';
import {
  type IAIStrategy,
  type GameAction,
  PLAY_CARD,
  DISCARD_CARD,
  newGameAction,
} from './IAIStrategy';

export class HeuristicStrategy implements IAIStrategy {
  public decideMove(aiPlayer: PlayerState, gameState: GameState): GameAction {
    // 1. If blocked, play remedy
    if (isBlocked(aiPlayer)) {
      const block = aiPlayer.inPlay.blocks[0];
      const remedy = getRemedyCardForBlock(aiPlayer, block);
      if (remedy) {
        return newGameAction(PLAY_CARD, remedy.id);
      }
    }

    // 2. If go is required, play Green Light
    if (!isBlocked(aiPlayer)) {
      // Special rule: must play green light to start progress
      const hasMadeProgress = hasProgress(aiPlayer);
      const greenLight = aiPlayer.hand.find(
        (card) => card.name === GREEN_LIGHT_NAME
      );
      if (!hasMadeProgress && greenLight) {
        return newGameAction(PLAY_CARD, greenLight.id);
      }
      else { //not blocked, but made progress, so play highest progress card
        const highestCard = getHighestProgressCard(aiPlayer);
        if (highestCard) {
          return newGameAction(PLAY_CARD, highestCard.id);
        }
      }
    }

    // 3. Block lead opponent
    const opponents = getPlayersOpponents(aiPlayer, gameState);
    if (opponents.length > 0) {
      const leader = getLeader(opponents);

      const blockCard = aiPlayer.hand.find( //TODO: this finds the *1st* block card in hand. but it's possible to have multiple block cards in hand.
        (card) => card.type === BLOCK_TYPE
      );
      if (blockCard && !isImmuneTo(leader, blockCard)) {
        return newGameAction(PLAY_CARD, blockCard.id, leader.id);
      }
    }

    // 4. Play immunity
    const immunityCard = aiPlayer.hand.find( //TODO: this finds the *1st* immunity card in hand. but it's possible to have multiple immunity cards in hand.
      (card) => card.type === IMMUNITY_TYPE
    );
    if (immunityCard && immunityCard.remediesType) {
      if (!hasImmunity(aiPlayer, immunityCard.remediesType)) {
        return newGameAction(PLAY_CARD, immunityCard.id);
      }
    }

    // 5. Discard
    return newGameAction(DISCARD_CARD, aiPlayer.hand[0].id);
  }
} 