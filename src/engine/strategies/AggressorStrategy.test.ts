import type { GameState, PlayerState, Card } from '../../types';
import { AggressorStrategy } from './AggressorStrategy';

const createCard = (overrides: Partial<Card> & { id: string }): Card => ({
  type: 'Progress',
  name: '100km',
  value: 100,
  ...overrides,
});

const createPlayerState = (
  overrides: Partial<PlayerState>
): PlayerState => ({
  hand: [],
  inPlay: { progress: [], blocks: [], immunities: [] },
  totalKm: 0,
  ...overrides,
});

describe('AggressorStrategy', () => {
  let strategy: AggressorStrategy;

  beforeEach(() => {
    strategy = new AggressorStrategy();
  });

  it('prioritizes blocking the leader', () => {
    const block = createCard({ id: 'b1', type: 'Block', name: 'Red Light', blocksType: 'Go' });
    const progress = createCard({ id: 'p1', value: 100 });
    const aiPlayer = createPlayerState({ hand: [progress, block] });
    const leader = createPlayerState({ totalKm: 500 });
    const gameState: GameState = { players: [aiPlayer, leader], deck: [], discard: [], turnIndex: 0 };

    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual({ type: 'PLAY_CARD', cardId: 'b1' });
  });

  it('makes progress if it cannot attack', () => {
    const progress = createCard({ id: 'p1', value: 100 });
    const aiPlayer = createPlayerState({ hand: [progress] });
    // Leader is immune
    const leader = createPlayerState({
      totalKm: 500,
      inPlay: {
        ...createPlayerState({}).inPlay,
        immunities: [createCard({ id: 'i1', type: 'Immunity', remediesType: 'Go' })],
      },
    });
    const block = createCard({ id: 'b1', type: 'Block', name: 'Red Light', blocksType: 'Go' });
    aiPlayer.hand.push(block); // Add block card to hand
    
    const gameState: GameState = { players: [aiPlayer, leader], deck: [], discard: [], turnIndex: 0 };

    const action = strategy.decideMove(aiPlayer, gameState);
    // Should choose to play progress because leader is immune
    expect(action).toEqual({ type: 'PLAY_CARD', cardId: 'p1' });
  });

  it('discards as a last resort', () => {
    const card = createCard({ id: 'c1', type: 'Remedy', name: 'Repair', remediesType: 'Tire' });
    const aiPlayer = createPlayerState({ hand: [card] });
    // No opponents to attack
    const gameState: GameState = { players: [aiPlayer], deck: [], discard: [], turnIndex: 0 };

    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual({ type: 'DISCARD_CARD', cardId: 'c1' });
  });
}); 