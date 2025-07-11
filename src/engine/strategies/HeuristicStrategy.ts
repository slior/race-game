import type { Card, PlayerState, GameState } from '../../types';
import type { IAIStrategy, AIAction } from './IAIStrategy';

export class HeuristicStrategy implements IAIStrategy {
  public decideMove(aiPlayer: PlayerState, gameState: GameState): AIAction {
    const isBlocked = aiPlayer.inPlay.blocks.length > 0;

    // 1. If blocked, play remedy
    if (isBlocked) {
      const block = aiPlayer.inPlay.blocks[0];
      const remedy = aiPlayer.hand.find(
        (card) => card.remediesType === block.blocksType
      );
      if (remedy) {
        return { type: 'PLAY_CARD', cardId: remedy.id };
      }
    }

    // 2. If go is required, play Green Light
    if (!isBlocked) {
        // Special rule: must play green light to start progress
        const hasMadeProgress = aiPlayer.inPlay.progress.length > 0;
        const hasGreenLightCardInHand = aiPlayer.hand.some((card) => card.name === 'Green Light');
        if (!hasMadeProgress && hasGreenLightCardInHand) {
            const greenLight = aiPlayer.hand.find((card) => card.name === 'Green Light');
            if (greenLight) {
                return { type: 'PLAY_CARD', cardId: greenLight.id };
            }
        }
    }

    // 3. Play highest progress card
    if (!isBlocked) {
      const progressCards = aiPlayer.hand.filter(
        (card) => card.type === 'Progress'
      );
      if (progressCards.length > 0) {
        const highestCard = progressCards.reduce((prev: Card, current: Card) =>
          (prev.value ?? 0) > (current.value ?? 0) ? prev : current
        );
        return { type: 'PLAY_CARD', cardId: highestCard.id };
      }
    }

    // 4. Block lead opponent
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

    // 5. Play immunity
    const immunityCard = aiPlayer.hand.find((card) => card.type === 'Immunity');
    if (immunityCard && immunityCard.remediesType) {
      const alreadyHasImmunity = aiPlayer.inPlay.immunities.some(
        (immunity) => immunity.remediesType === immunityCard.remediesType
      );
      if (!alreadyHasImmunity) {
        return { type: 'PLAY_CARD', cardId: immunityCard.id };
      }
    }

    // 6. Discard
    return { type: 'DISCARD_CARD', cardId: aiPlayer.hand[0].id };
  }
} 