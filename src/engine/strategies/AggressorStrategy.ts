import type { PlayerState, GameState } from '../../types';
import type { IAIStrategy, AIAction } from './IAIStrategy';

export class AggressorStrategy implements IAIStrategy {
  public decideMove(aiPlayer: PlayerState, gameState: GameState): AIAction {
    // 1. Block the leader
    const opponents = gameState.players.filter((p) => p !== aiPlayer);
    if (opponents.length > 0) {
      const leader = opponents.reduce((prev, current) =>
        prev.totalKm > current.totalKm ? prev : current
      );

      const blockCard = aiPlayer.hand.find((card) => card.type === 'Block');
      if (blockCard && blockCard.blocksType) {
        const isImmune = leader.inPlay.immunities.some(
          (immunity) => immunity.remediesType === blockCard.blocksType
        );
        if (!isImmune) {
          return { type: 'PLAY_CARD', cardId: blockCard.id };
        }
      }
    }

    // 2. Try to make progress if unable to attack
    const isBlocked = aiPlayer.inPlay.blocks.length > 0;
    if (!isBlocked) {
      const progressCards = aiPlayer.hand.filter(
        (card) => card.type === 'Progress'
      );
      if (progressCards.length > 0) {
        const highestCard = progressCards.reduce((prev, current) =>
          (prev.value ?? 0) > (current.value ?? 0) ? prev : current
        );
        return { type: 'PLAY_CARD', cardId: highestCard.id };
      }
    }

    // 3. Discard as last resort
    return { type: 'DISCARD_CARD', cardId: aiPlayer.hand[0].id };
  }
} 