import { BLOCK_TYPE, type PlayerState, type GameState, isImmuneTo, 
    // isBlocked, getHighestProgressCard,
    getPlayersOpponents, getLeader, isCardPlayable, 
    // REMEDY_TYPE, hasGreenLight 
} from '../../types';
import { type IAIStrategy, type GameAction, PLAY_CARD, DISCARD_CARD, newGameAction } from './IAIStrategy';

export class AggressorStrategy implements IAIStrategy {

    public decideMove(aiPlayer: PlayerState, gameState: GameState): GameAction {
        const opponents = getPlayersOpponents(aiPlayer, gameState);
        const leader = opponents.length > 0 ? getLeader(opponents) : null;

        // 1. First priority: Play a block card on the leader if possible
        if (leader) {
            for (const card of aiPlayer.hand) {
                if (card.type === BLOCK_TYPE && !isImmuneTo(leader, card)) {
                    // Check if this move is actually playable
                    const tempGameState: GameState = {
                        ...gameState,
                        actionState: { /*type: 'awaiting-target',*/ cardId: card.id, targetId: leader.id }
                    };
                    if (isCardPlayable(card, tempGameState)) {
                        return newGameAction(PLAY_CARD, card.id, leader.id);
                    }
                }
            }
        }
        
        // 2. Second priority: Play any other playable card
        for (const card of aiPlayer.hand) {
            if (isCardPlayable(card, gameState)) {
                // For block cards, we still need to find a valid target
                if (card.type === BLOCK_TYPE) {
                    const validOpponent = opponents.find(o => !isImmuneTo(o, card));
                    if (validOpponent) {
                        return newGameAction(PLAY_CARD, card.id, validOpponent.id);
                    }
                } else {
                    return newGameAction(PLAY_CARD, card.id);
                }
            }
        }

        // 3. Last resort: Discard the least valuable card (e.g., lowest progress)
        // For now, we'll just discard the first card as before, but this could be smarter.
        return newGameAction(DISCARD_CARD, aiPlayer.hand[0].id);
    }
} 