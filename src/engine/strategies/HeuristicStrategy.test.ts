import {
  type GameState,
  type PlayerState,
  PROGRESS_100_KM_NAME,
  FLAT_TIRE_NAME,
  createBlockCard,
  createRemedyCard,
  GREEN_LIGHT_NAME,
  SPARE_TIRE_NAME,
  createProgressCard,
  PROGRESS_25_KM_NAME,
  RED_LIGHT_NAME,
  REPAIR_NAME,
} from '../../types';
import { HeuristicStrategy } from './HeuristicStrategy';
import {
  newGameAction,
  PLAY_CARD,
  DISCARD_CARD,
} from './IAIStrategy';

const createPlayerState = (
  overrides: Partial<PlayerState>
): PlayerState => ({
  id: 'test-player',
  hand: [],
  inPlay: { progress: [], blocks: [], immunities: [] },
  totalKm: 0,
  isReady: false,
  aiStrategy: 'Heuristic',
  isThinking: false,
  isTargeted: false,
  ...overrides,
});

describe('HeuristicStrategy', () => {
  let strategy: HeuristicStrategy;

  beforeEach(() => {
    strategy = new HeuristicStrategy();
  });

  it('chooses to play a remedy card if blocked', () => {
    const flatTire = createBlockCard('c1', FLAT_TIRE_NAME);
    const spareTireId = 'c2';
    const repair = createRemedyCard(spareTireId, SPARE_TIRE_NAME);
    const aiPlayer = createPlayerState({
      hand: [repair],
      inPlay: { ...createPlayerState({}).inPlay, blocks: [flatTire] },
    });
    const gameState: GameState = { players: [aiPlayer], deck: [], discard: [], turnIndex: 0, events: [] };

    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual(newGameAction(PLAY_CARD, spareTireId));
  });

  it('chooses to play Green Light if no progress has been made', () => {
    const greenLightId = 'gl';
    const greenLight = createRemedyCard(greenLightId, GREEN_LIGHT_NAME);
    const aiPlayer = createPlayerState({ hand: [greenLight] });
    const gameState: GameState = { players: [aiPlayer], deck: [], discard: [], turnIndex: 0, events: [] };
    
    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual(newGameAction(PLAY_CARD, greenLightId));
  });

  it('chooses the highest progress card when not blocked', () => {
    const card50Id = 'c1';
    const card50 = createProgressCard(card50Id, PROGRESS_25_KM_NAME);
    const card100Id = 'c2';
    const card100 = createProgressCard(card100Id, PROGRESS_100_KM_NAME);
    const aiPlayer = createPlayerState({
      hand: [card50, card100],
      inPlay: { ...createPlayerState({}).inPlay, progress: [createProgressCard('p1', PROGRESS_25_KM_NAME)] },
    });
    const gameState: GameState = {
      players: [aiPlayer],
      deck: [],
      discard: [],
      turnIndex: 0,
      events: [],
    };

    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual(newGameAction(PLAY_CARD, card100Id));
  });

  it('chooses to block the leader if unable to move', () => {
    const blockCard = createBlockCard('b1', RED_LIGHT_NAME);
    const aiPlayer = createPlayerState({ id: 'ai-player', hand: [blockCard] });
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

  it('chooses to discard a card as a last resort', () => {
    const cardId = 'c1';
    const card = createRemedyCard(cardId, REPAIR_NAME);
    const aiPlayer = createPlayerState({ hand: [card] });
    const otherPlayer = createPlayerState({ id: 'other-player' });
    const gameState: GameState = { players: [aiPlayer, otherPlayer], deck: [], discard: [], turnIndex: 0, events: [] };

    const action = strategy.decideMove(aiPlayer, gameState);
    expect(action).toEqual(newGameAction(DISCARD_CARD, cardId));
  });
}); 