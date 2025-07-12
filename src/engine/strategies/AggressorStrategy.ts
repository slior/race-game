import { BLOCK_TYPE, type PlayerState, type GameState, isImmuneTo, isBlocked, getHighestProgressCard, getPlayersOpponents, getLeader } from '../../types';
import { type IAIStrategy, type GameAction, PLAY_CARD, DISCARD_CARD, newGameAction } from './IAIStrategy';

export class AggressorStrategy implements IAIStrategy {
  public decideMove(aiPlayer: PlayerState, gameState: GameState): GameAction {
    // 1. Block the leader
    const opponents = getPlayersOpponents(aiPlayer, gameState);
    if (opponents.length > 0) {
      const leader = getLeader(opponents);

      const blockCard = aiPlayer.hand.find((card) => card.type === BLOCK_TYPE);
      if (blockCard &&  !isImmuneTo(leader,blockCard))
        return newGameAction(PLAY_CARD, blockCard.id);
    }

    // 2. Try to make progress if unable to attack
    if (!isBlocked(aiPlayer)) {
      const highestCard = getHighestProgressCard(aiPlayer);
      if (highestCard) {
        return newGameAction(PLAY_CARD, highestCard.id);
      }
    }

    // 3. Discard as last resort
    return newGameAction(DISCARD_CARD, aiPlayer.hand[0].id);
  }
} 