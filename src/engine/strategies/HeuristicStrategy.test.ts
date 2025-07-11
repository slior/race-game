import type { GameState, PlayerState, Card } from '../../types';
import { HeuristicStrategy } from './HeuristicStrategy';

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

describe('HeuristicStrategy', () => {
  let strategy: HeuristicStrategy;

  beforeEach(() => {
    strategy = new HeuristicStrategy();
  });

  it('chooses to play a remedy card if blocked', () => {
    const flatTire = createCard({ id: 'c1', type: 'Block', name: 'Flat Tire', blocksType: 'Tire' });
    const repair = createCard({ id: 'c2', type: 'Remedy', name: 'Repair', remediesType: 'Tire' });
    const aiPlayer = createPlayerState({
      hand: [repair],
      inPlay: { ...createPlayerState({}).inPlay, blocks: [flatTire] },
    });
    const gameState: GameState = { players: [aiPlayer], deck: [], discard: [], turnIndex: 0 };

    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual({ type: 'PLAY_CARD', cardId: 'c2' });
  });

  it('chooses to play Green Light if no progress has been made', () => {
    const greenLight = createCard({ id: 'gl', name: 'Green Light', type: 'Remedy', remediesType: 'Go' });
    const aiPlayer = createPlayerState({ hand: [greenLight] });
    const gameState: GameState = { players: [aiPlayer], deck: [], discard: [], turnIndex: 0 };
    
    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual({ type: 'PLAY_CARD', cardId: 'gl' });
  });

  it('chooses the highest progress card when not blocked', () => {
    const card50 = createCard({ id: 'c1', value: 50, name: '50km' });
    const card100 = createCard({ id: 'c2', value: 100, name: '100km' });
    const aiPlayer = createPlayerState({ hand: [card50, card100], inPlay: { ...createPlayerState({}).inPlay, progress: [createCard({id: 'p1'})] } });
    const gameState: GameState = { players: [aiPlayer], deck: [], discard: [], turnIndex: 0 };

    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual({ type: 'PLAY_CARD', cardId: 'c2' });
  });

  it('chooses to block the leader if unable to move', () => {
    const block = createCard({ id: 'b1', type: 'Block', name: 'Red Light', blocksType: 'Go' });
    const aiPlayer = createPlayerState({ hand: [block] });
    const leader = createPlayerState({ totalKm: 500 });
    const gameState: GameState = { players: [aiPlayer, leader], deck: [], discard: [], turnIndex: 0 };
    
    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual({ type: 'PLAY_CARD', cardId: 'b1' });
  });

  it('chooses to discard a card as a last resort', () => {
    const card50 = createCard({ id: 'c1', type: 'Remedy', name: 'Repair', remediesType: 'Tire' });
    const aiPlayer = createPlayerState({ hand: [card50] });
    const gameState: GameState = { players: [aiPlayer], deck: [], discard: [], turnIndex: 0 };

    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual({ type: 'DISCARD_CARD', cardId: 'c1' });
  });
}); 