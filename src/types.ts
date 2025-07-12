

export const BLOCK_TYPE = 'Block';
export const PROGRESS_TYPE = 'Progress';
export const REMEDY_TYPE = 'Remedy';
export const IMMUNITY_TYPE = 'Immunity';
export type CardType = typeof BLOCK_TYPE | typeof PROGRESS_TYPE | typeof REMEDY_TYPE | typeof IMMUNITY_TYPE;

export const BLOCK_STOP_TYPE = 'Stop';
export const BLOCK_HAZARD_TYPE = 'Hazard';
export const BLOCK_ACCIDENT_TYPE = 'Accident';
export const BLOCK_SPEED_LIMIT_TYPE = 'Speed Limit';
export const BLOCK_FLAT_TIRE_TYPE = 'Flat Tire';
export const BLOCK_OUT_OF_GAS_TYPE = 'Out of Gas';
export type BlockType = typeof BLOCK_STOP_TYPE | typeof BLOCK_HAZARD_TYPE | typeof BLOCK_ACCIDENT_TYPE | typeof BLOCK_SPEED_LIMIT_TYPE | typeof BLOCK_FLAT_TIRE_TYPE | typeof BLOCK_OUT_OF_GAS_TYPE;

export const GREEN_LIGHT_NAME = 'Green Light';
export const RED_LIGHT_NAME = 'Red Light';
export const FLAT_TIRE_NAME = 'Flat Tire';
export const OUT_OF_GAS_NAME = 'Out of Gas';
export const ACCIDENT_NAME = 'Accident';
export const SPEED_LIMIT_NAME = 'Speed Limit';
export const SPARE_TIRE_NAME = 'Spare Tire';
export const GASOLINE_NAME = 'Gasoline';
export const REPAIR_NAME = 'Repair';
export const RIGHT_OF_WAY_NAME = 'Right of Way';
export const PUNCTURE_PROOF_TIRES_NAME = 'Puncture-Proof Tires';
export const FUEL_TANK_NAME = 'Fuel Tank';
export const DRIVING_ACE_NAME = 'Driving Ace';

export const PROGRESS_25_KM_NAME = '25km';
export const PROGRESS_50_KM_NAME = '50km';
export const PROGRESS_75_KM_NAME = '75km';
export const PROGRESS_100_KM_NAME = '100km';
export const PROGRESS_200_KM_NAME = '200km';


// --- Card interfaces ---

export type CardName =
  | typeof GREEN_LIGHT_NAME | typeof RED_LIGHT_NAME | typeof FLAT_TIRE_NAME | typeof OUT_OF_GAS_NAME | typeof ACCIDENT_NAME | typeof SPEED_LIMIT_NAME
  | typeof SPARE_TIRE_NAME | typeof GASOLINE_NAME | typeof REPAIR_NAME
  | typeof RIGHT_OF_WAY_NAME | typeof PUNCTURE_PROOF_TIRES_NAME | typeof FUEL_TANK_NAME | typeof DRIVING_ACE_NAME
  | typeof PROGRESS_25_KM_NAME | typeof PROGRESS_50_KM_NAME | typeof PROGRESS_75_KM_NAME | typeof PROGRESS_100_KM_NAME | typeof PROGRESS_200_KM_NAME;


export interface Card {
  id: string;
  type: CardType;
  name: CardName;
  value?: number;          // for Progress
  blocksType?: BlockType;     // for Block
  remediesType?: BlockType;   // for Remedy/Immunity
}

export interface GameEvent {
  message: string;
  type: 'play' | 'discard' | 'draw' | 'system';
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
  actionState?: {
    type: 'awaiting-target';
    cardId: string;
  } | null;
  events: GameEvent[];
}


/**
 * Checks if a player is immune to the effect of a given Block card.
 *
 * This function determines whether the player has an immunity card in play
 * that matches the type of block specified by the provided card.
 *
 * @param player - The PlayerState object representing the player to check.
 * @param card - The Card object representing the Block card to check immunity against.
 * @returns True if the player is immune to the block type of the card, false otherwise.
 */
export function isImmuneTo(player: PlayerState, card: Card): boolean {
    if (!player || !card || !card.blocksType)
        return false;
    // return player.inPlay.immunities.some((immunity) => immunity.remediesType === card.blocksType);
    return hasImmunity(player, card.blocksType);
}

/**
 * Determines if a player is currently blocked.
 *
 * This function checks whether the player has any Block cards in their in-play area,
 * indicating that the player is currently blocked and unable to make progress.
 *
 * @param player - The PlayerState object representing the player to check.
 * @returns True if the player has at least one Block card in play, false otherwise.
 */
export function isBlocked(player: PlayerState): boolean {
    return player.inPlay.blocks.length > 0;
}

/**
 * Checks if a player has made any progress.
 *
 * This function determines whether the player has made any progress by
 * checking if there are any Progress cards in the player's in-play progress array.
 *
 * @param player - The PlayerState object representing the player to check.
 * @returns True if the player has at least one Progress card in play, false otherwise.
 */
export function hasProgress(player: PlayerState): boolean {
    return player.inPlay.progress.length > 0;
}

/**
 * Returns the highest value Progress card from a player's hand.
 *
 * This function examines all Progress cards in the player's hand and selects the one
 * with the highest value. If the player has no Progress cards in hand, it returns null.
 *
 * @param player - The PlayerState object representing the player whose hand is to be checked.
 * @returns The Progress card with the highest value, or null if none are found.
 */
export function getHighestProgressCard(player: PlayerState): Card | null {
    let progressCards = getProgressCards(player);
    if (progressCards.length === 0)
        return null;
    return progressCards.reduce((prev, current) =>
        (prev.value ?? 0) > (current.value ?? 0) ? prev : current
    );
}

/**
 * Retrieves all Progress cards from a player's hand.
 *
 * This function filters the player's hand and returns an array of cards
 * that are of the Progress type.
 *
 * @param player - The PlayerState object representing the player whose hand is to be checked.
 * @returns An array of Card objects that are Progress cards.
 */
export function getProgressCards(player: PlayerState): Card[] {
    return player.hand.filter((card) => card.type === PROGRESS_TYPE);
}

/**
 * Retrieves a Remedy card that can be used to block a specific type of Block card.
 *
 * This function searches the player's hand for a Remedy card that matches the type
 * of block specified by the provided card. If no matching Remedy card is found,
 * it returns null.
 *
 * @param player - The PlayerState object representing the player whose hand is to be checked.
 * @param blockCard - The Card object representing the Block card to find a remedy for.
 * @returns The Remedy card that can be used to block the Block card, or null if none is found.
 */
export function getRemedyCardForBlock(player: PlayerState, blockCard: Card): Card | null {
    return player.hand.find((card) => card.remediesType === blockCard.blocksType) ?? null;
}

/**
 * Retrieves all opponents of a given player from the game state.
 *
 * This function filters the list of players in the game state and returns
 * an array containing all players except the specified player.
 *
 * @param player - The PlayerState object representing the current player.
 * @param gameState - The GameState object containing all players in the game.
 * @returns An array of PlayerState objects representing the opponents.
 */
export function getPlayersOpponents(player: PlayerState, gameState: GameState): PlayerState[] {
    return gameState.players.filter((p) => p !== player);
}

/**
 * Returns the player with the highest total kilometers (the leader).
 *
 * This function iterates through the list of players and finds the player
 * who has accumulated the most kilometers. If multiple players have the same
 * highest total, the first encountered is returned.
 *
 * @param players - An array of PlayerState objects representing the players.
 * @returns The PlayerState object representing the leader (highest totalKm).
 */
export function getLeader(players: PlayerState[]): PlayerState {
    return players.reduce((prev, current) =>
        prev.totalKm > current.totalKm ? prev : current
    );
}

/**
 * Checks if the player currently has an immunity card for a specific remedies type.
 *
 * This function examines the player's in-play immunities to determine if any of them
 * match the provided remediesType. If a matching immunity is found, it returns true;
 * otherwise, it returns false.
 *
 * @param player - The PlayerState object representing the player to check.
 * @param remediesType - The string representing the remedies type to check for immunity.
 * @returns True if the player has an immunity for the specified remedies type, false otherwise.
 */
export function hasImmunity(player: PlayerState, remediesType: string): boolean {
    return player.inPlay.immunities.some((immunity) => immunity.remediesType === remediesType);
}