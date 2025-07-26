import {
  type GameState,
  type PlayerState,
  type Card,
  BLOCK_STOP_TYPE,
  PROGRESS_TYPE,
  BLOCK_TYPE,
  REMEDY_TYPE,
  IMMUNITY_TYPE,
  BLOCK_FLAT_TIRE_TYPE,
  PROGRESS_100_KM_NAME,
  GREEN_LIGHT_NAME,
  REPAIR_NAME,
} from '../../types';
import { AggressorStrategy } from './AggressorStrategy';
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
  isReady: false,
  aiStrategy: 'Aggressor',
  isThinking: false,
  isTargeted: false,
  ...overrides,
});

describe('AggressorStrategy', () => {
  let strategy: AggressorStrategy;

  beforeEach(() => {
    strategy = new AggressorStrategy();
  });

  it('prioritizes blocking the leader', () => {
    const block = createCard({
      id: 'b1',
      type: BLOCK_TYPE,
      name: 'Red Light',
      blocksType: BLOCK_STOP_TYPE,
    });
    const progress = createCard({ id: 'p1', value: 100 });
    const aiPlayer = createPlayerState({ hand: [progress, block] });
    const leader = createPlayerState({ id: 'leader', totalKm: 500 });
    const gameState: GameState = {
      players: [aiPlayer, leader],
      turnIndex: 0,
      deck: [],
      discard: [],
      events: [],
    };

    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual(newGameAction(PLAY_CARD, 'b1', 'leader'));
  });

  it('makes progress if it cannot attack', () => {
    const progress = createCard({ id: 'p1', value: 100 });
    const greenLight = createCard({
      id: 'gl1',
      type: REMEDY_TYPE,
      name: GREEN_LIGHT_NAME,
      remediesType: BLOCK_STOP_TYPE,
    });
    const aiPlayer = createPlayerState({
      hand: [progress],
      inPlay: { ...createPlayerState({}).inPlay, progress: [greenLight] },
    });
    // Leader is immune
    const leader = createPlayerState({
      id: 'leader-immune',
      totalKm: 500,
      inPlay: {
        ...createPlayerState({}).inPlay,
        immunities: [
          createCard({
            id: 'i1',
            type: IMMUNITY_TYPE,
            remediesType: BLOCK_STOP_TYPE,
          }),
        ],
      },
    });
    const block = createCard({
      id: 'b1',
      type: BLOCK_TYPE,
      name: 'Red Light',
      blocksType: BLOCK_STOP_TYPE,
    });
    aiPlayer.hand.push(block); // Add block card to hand

    const gameState: GameState = {
      players: [aiPlayer, leader],
      deck: [],
      discard: [],
      turnIndex: 0,
      events: [],
    };

    const action = strategy.decideMove(aiPlayer, gameState);
    // Should choose to play progress because leader is immune
    expect(action).toEqual(newGameAction(PLAY_CARD, 'p1'));
  });

  it('discards as a last resort', () => {
    const card = createCard({ id: 'c1', type: REMEDY_TYPE, name: REPAIR_NAME, remediesType: BLOCK_FLAT_TIRE_TYPE });
    const aiPlayer = createPlayerState({ hand: [card] });
    // No opponents to attack
    const gameState: GameState = {
      players: [aiPlayer],
      deck: [],
      discard: [],
      turnIndex: 0,
      events: [],
    };

    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual(newGameAction(DISCARD_CARD, 'c1'));
  });
}); 