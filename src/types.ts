export type CardType = 'Progress' | 'Block' | 'Remedy' | 'Immunity';
export interface Card {
  id: string;
  type: CardType;
  name: string;
  value?: number;          // for Progress
  blocksType?: string;     // for Block
  remediesType?: string;   // for Remedy/Immunity
}
export interface PlayerState {
  hand: Card[];
  inPlay: { progress: Card[]; blocks: Card[]; immunities: Card[] };
  totalKm: number;
}
export interface GameState {
  deck: Card[];
  discard: Card[];
  players: PlayerState[];
  turnIndex: number;
}
