type CardType = 'Progress' | 'Block' | 'Remedy' | 'Immunity';
interface Card {
  id: string;
  type: CardType;
  name: string;
  value?: number;          // for Progress
  blocksType?: string;     // for Block
  remediesType?: string;   // for Remedy/Immunity
}
interface PlayerState {
  hand: Card[];
  inPlay: { progress: Card[]; blocks: Card[]; immunities: Card[] };
  totalKm: number;
}
interface GameState {
  deck: Card[];
  discard: Card[];
  players: PlayerState[];
  turnIndex: number;
}
