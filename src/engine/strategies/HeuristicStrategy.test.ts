import {
  type GameState,
  type PlayerState,
  type Card,
  PROGRESS_TYPE,
  BLOCK_TYPE,
  REMEDY_TYPE,
  BLOCK_HAZARD_TYPE,
  BLOCK_STOP_TYPE,
  PROGRESS_100_KM_NAME,
  BLOCK_FLAT_TIRE_TYPE,
  FLAT_TIRE_NAME,
  REPAIR_NAME,
} from '../../types';
import { HeuristicStrategy } from './HeuristicStrategy';
import {
  newGameAction,
  PLAY_CARD,
  DISCARD_CARD,
} from './IAIStrategy';

const createCard = (overrides: Partial<Card> & { id: string }): Card => ({
  type: PROGRESS_TYPE,
  name: PROGRESS_100_KM_NAME,
  value: 100,
  ...overrides,
});

const createPlayerState = (
  overrides: Partial<PlayerState>
): PlayerState => ({
  id: 'test-player',
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
    const flatTire = createCard({ id: 'c1', type: BLOCK_TYPE, name: FLAT_TIRE_NAME, blocksType: BLOCK_FLAT_TIRE_TYPE });
    const repair = createCard({ id: 'c2', type: REMEDY_TYPE, name: REPAIR_NAME, remediesType: BLOCK_FLAT_TIRE_TYPE });
    const aiPlayer = createPlayerState({
      hand: [repair],
      inPlay: { ...createPlayerState({}).inPlay, blocks: [flatTire] },
    });
    const gameState: GameState = { players: [aiPlayer], deck: [], discard: [], turnIndex: 0, events: [] };

    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual(newGameAction(PLAY_CARD, 'c2'));
  });

  it('chooses to play Green Light if no progress has been made', () => {
    const greenLight = createCard({
      id: 'gl',
      name: 'Green Light',
      type: REMEDY_TYPE,
      remediesType: BLOCK_STOP_TYPE,
    });
    const aiPlayer = createPlayerState({ hand: [greenLight] });
    const gameState: GameState = { players: [aiPlayer], deck: [], discard: [], turnIndex: 0, events: [] };
    
    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual(newGameAction(PLAY_CARD, 'gl'));
  });

  it('chooses the highest progress card when not blocked', () => {
    const card50 = createCard({ id: 'c1', value: 50, name: '50km' });
    const card100 = createCard({ id: 'c2', value: 100, name: '100km' });
    const aiPlayer = createPlayerState({
      hand: [card50, card100],
      inPlay: { ...createPlayerState({}).inPlay, progress: [createCard({ id: 'p1' })] },
    });
    const gameState: GameState = {
      players: [aiPlayer],
      deck: [],
      discard: [],
      turnIndex: 0,
      events: [],
    };

    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual(newGameAction(PLAY_CARD, 'c2'));
  });

  it('chooses to block the leader if unable to move', () => {
    const block = createCard({
      id: 'b1',
      type: BLOCK_TYPE,
      name: 'Red Light',
      blocksType: BLOCK_STOP_TYPE,
    });
    const aiPlayer = createPlayerState({ hand: [block] });
    const leader = createPlayerState({ totalKm: 500 });
    const gameState: GameState = { players: [aiPlayer, leader], deck: [], discard: [], turnIndex: 0, events: [] };
    
    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual(newGameAction(PLAY_CARD, 'b1'));
  });

  it('chooses to discard a card as a last resort', () => {
    const card50 = createCard({
      id: 'c1',
      type: REMEDY_TYPE,
      name: 'Repair',
      remediesType: BLOCK_HAZARD_TYPE,
    });
    const aiPlayer = createPlayerState({ hand: [card50] });
    const gameState: GameState = { players: [aiPlayer], deck: [], discard: [], turnIndex: 0, events: [] };

    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual(newGameAction(DISCARD_CARD, 'c1'));
  });
}); 