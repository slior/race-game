

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

function createCard(id: string, type: CardType, name: CardName, value?: number, blocksType?: BlockType, remediesType?: BlockType): Card
{
    return { id, type, name, value, blocksType, remediesType };
}

export function createImmunityCard(id: string, name: CardName): Card
{
    const immunityMap: Record<CardName, BlockType | undefined> = {
        [DRIVING_ACE_NAME]: BLOCK_ACCIDENT_TYPE,
        [PUNCTURE_PROOF_TIRES_NAME]: BLOCK_FLAT_TIRE_TYPE,
        [FUEL_TANK_NAME]: BLOCK_OUT_OF_GAS_TYPE,
        [GASOLINE_NAME]: BLOCK_OUT_OF_GAS_TYPE,
        [RIGHT_OF_WAY_NAME]: BLOCK_STOP_TYPE,
        // Other cards are not immunity cards
        [GREEN_LIGHT_NAME]: undefined,
        [RED_LIGHT_NAME]: undefined,
        [FLAT_TIRE_NAME]: undefined,
        [OUT_OF_GAS_NAME]: undefined,
        [ACCIDENT_NAME]: undefined,
        [SPEED_LIMIT_NAME]: undefined,
        [SPARE_TIRE_NAME]: undefined,
        [REPAIR_NAME]: undefined,
        [PROGRESS_25_KM_NAME]: undefined,
        [PROGRESS_50_KM_NAME]: undefined,
        [PROGRESS_75_KM_NAME]: undefined,
        [PROGRESS_100_KM_NAME]: undefined,
        [PROGRESS_200_KM_NAME]: undefined,
    };
    const blockType = immunityMap[name];
    if (!blockType) {
        throw new Error(`Card name "${name}" is not a valid immunity card.`);
    }
    return createCard(id, IMMUNITY_TYPE, name, undefined, undefined, blockType);
}


/**
 * Creates a remedy card object based on the provided card name.
 *
 * This function maps a valid remedy card name to its corresponding BlockType,
 * and returns a Card object representing the remedy card. If the provided name
 * does not correspond to a valid remedy card, an error is thrown.
 *
 * @param id - The unique identifier for the card.
 * @param name - The name of the remedy card to create.
 * @returns A Card object representing the remedy card.
 * @throws {Error} If the provided name is not a valid remedy card.
 */
export function createRemedyCard(id: string, name: CardName): Card
{
    // Map of remedy card names to their corresponding BlockType
    const remedyMap: Record<CardName, BlockType | undefined> = {
        [GREEN_LIGHT_NAME]: BLOCK_STOP_TYPE,
        [SPARE_TIRE_NAME]: BLOCK_FLAT_TIRE_TYPE,
        [GASOLINE_NAME]: BLOCK_OUT_OF_GAS_TYPE,
        [REPAIR_NAME]: BLOCK_ACCIDENT_TYPE,
        [RIGHT_OF_WAY_NAME]: BLOCK_STOP_TYPE, // also grants immunity, but for remedy, treat as Stop
        [PUNCTURE_PROOF_TIRES_NAME]: BLOCK_FLAT_TIRE_TYPE,
        [FUEL_TANK_NAME]: BLOCK_OUT_OF_GAS_TYPE,
        [DRIVING_ACE_NAME]: BLOCK_ACCIDENT_TYPE,
        // Progress cards and block cards are not remedies
        [RED_LIGHT_NAME]: undefined,
        [FLAT_TIRE_NAME]: undefined,
        [OUT_OF_GAS_NAME]: undefined,
        [ACCIDENT_NAME]: undefined,
        [SPEED_LIMIT_NAME]: undefined,
        [PROGRESS_25_KM_NAME]: undefined,
        [PROGRESS_50_KM_NAME]: undefined,
        [PROGRESS_75_KM_NAME]: undefined,
        [PROGRESS_100_KM_NAME]: undefined,
        [PROGRESS_200_KM_NAME]: undefined,
    };

    const remediesType = remedyMap[name];
    if (!remediesType) {
        throw new Error(`Card name "${name}" is not a valid remedy card.`);
    }

    return createCard(id, REMEDY_TYPE, name, undefined, undefined, remediesType);
}

/**
 * Creates a progress card object based on the provided card name.
 *
 * This function maps a valid progress card name to its corresponding value,
 * and returns a Card object representing the progress card. If the provided name
 * does not correspond to a valid progress card, an error is thrown.
 *
 * @param id - The unique identifier for the card.
 * @param name - The name of the progress card to create.
 * @returns A Card object representing the progress card.
 * @throws {Error} If the provided name is not a valid progress card.
 */
export function createProgressCard(id: string, name: CardName): Card
{
    const progressMap: Record<CardName, number | undefined> = {
        [PROGRESS_25_KM_NAME]: 25,
        [PROGRESS_50_KM_NAME]: 50,
        [PROGRESS_75_KM_NAME]: 75,
        [PROGRESS_100_KM_NAME]: 100,
        [PROGRESS_200_KM_NAME]: 200,
        // Other cards are not progress cards
        [GREEN_LIGHT_NAME]: undefined,
        [RED_LIGHT_NAME]: undefined,
        [FLAT_TIRE_NAME]: undefined,
        [OUT_OF_GAS_NAME]: undefined,
        [ACCIDENT_NAME]: undefined,
        [SPEED_LIMIT_NAME]: undefined,
        [SPARE_TIRE_NAME]: undefined,
        [GASOLINE_NAME]: undefined,
        [REPAIR_NAME]: undefined,
        [RIGHT_OF_WAY_NAME]: undefined,
        [PUNCTURE_PROOF_TIRES_NAME]: undefined,
        [FUEL_TANK_NAME]: undefined,
        [DRIVING_ACE_NAME]: undefined,
    };

    const value = progressMap[name];
    if (!value) {
        throw new Error(`Card name "${name}" is not a valid progress card.`);
    }

    return createCard(id, PROGRESS_TYPE, name, value);
}   

/**
 * Creates a block card object based on the provided card name.
 *
 * This function maps a valid block card name to its corresponding BlockType,
 * and returns a Card object representing the block card. If the provided name
 * does not correspond to a valid block card, an error is thrown.
 *
 * @param id - The unique identifier for the card.
 * @param name - The name of the block card to create.
 * @returns A Card object representing the block card.
 * @throws {Error} If the provided name is not a valid block card.
 */
export function createBlockCard(id: string, name: CardName): Card
{
    const blockMap: Record<CardName, BlockType | undefined> = {
        [RED_LIGHT_NAME]: BLOCK_STOP_TYPE,
        [FLAT_TIRE_NAME]: BLOCK_FLAT_TIRE_TYPE,
        [OUT_OF_GAS_NAME]: BLOCK_OUT_OF_GAS_TYPE,
        [ACCIDENT_NAME]: BLOCK_ACCIDENT_TYPE,
        [SPEED_LIMIT_NAME]: BLOCK_SPEED_LIMIT_TYPE,
        // Progress cards and remedy cards are not blocks
        [GREEN_LIGHT_NAME]: undefined,
        [SPARE_TIRE_NAME]: undefined,
        [GASOLINE_NAME]: undefined,
        [REPAIR_NAME]: undefined,
        [RIGHT_OF_WAY_NAME]: undefined,
        [PUNCTURE_PROOF_TIRES_NAME]: undefined,
        [FUEL_TANK_NAME]: undefined,
        [DRIVING_ACE_NAME]: undefined,
        [PROGRESS_25_KM_NAME]: undefined,
        [PROGRESS_50_KM_NAME]: undefined,
        [PROGRESS_75_KM_NAME]: undefined,
        [PROGRESS_100_KM_NAME]: undefined,
        [PROGRESS_200_KM_NAME]: undefined,
    };

    const blockType = blockMap[name];
    if (!blockType) {
        throw new Error(`Card name "${name}" is not a valid block card.`);
    }

    return createCard(id, BLOCK_TYPE, name, undefined, blockType);
}

  // Define event type constants
  export const GAME_EVENT_PLAY = 'play';
  export const GAME_EVENT_DISCARD = 'discard';
  export const GAME_EVENT_DRAW = 'draw';
  export const GAME_EVENT_SYSTEM = 'system';

/**
 * Represents a single event in the game log.
 *
 * This interface is used to record significant actions or system messages that occur during gameplay.
 * Each event contains a human-readable message and a type indicating the nature of the event.
 *
 * @property message - A descriptive string explaining the event (e.g., "Alice played 75 km", "Bob drew a card").
 * @property type - The category of the event, which can be:
 *   - 'play': A card was played.
 *   - 'discard': A card was discarded.
 *   - 'draw': A card was drawn from the deck.
 *   - 'system': A system-level message (e.g., game start, win notification).
 */
export interface GameEvent {
  message: string;

  type: typeof GAME_EVENT_PLAY | typeof GAME_EVENT_DISCARD | typeof GAME_EVENT_DRAW | typeof GAME_EVENT_SYSTEM;
}

/**
 * Represents the state of a player in the game.
 *
 * This interface encapsulates all relevant information about a player,
 * including their hand, cards in play, progress, and UI-related flags.
 *
 * @property id - The unique identifier for the player.
 * @property hand - The array of Card objects currently held by the player.
 * @property inPlay - An object containing arrays of cards the player has played:
 *   - progress: Progress cards the player has played.
 *   - blocks: Block cards currently affecting the player.
 *   - immunities: Immunity cards the player has acquired.
 * @property totalKm - The total kilometers accumulated by the player (from progress cards).
 * @property isReady - Indicates whether the player is ready to start the game (used for lobby/ready checks).
 * @property aiStrategy - The name of the AI strategy assigned to the player, or null if the player is human.
 * @property isThinking - UI flag indicating if the AI is currently "thinking" (used for visual feedback).
 * @property isTargeted - UI flag indicating if the player is currently being targeted by an action (used for visual feedback).
 */
export interface PlayerState {
  id: string;
  hand: Card[];
  inPlay: { progress: Card[]; blocks: Card[]; immunities: Card[] };
  totalKm: number;
  isReady: boolean;
  aiStrategy: string | null; // null for human players
  isThinking: boolean; // for UI feedback
  isTargeted: boolean; // for UI feedback
}

/**
 * Determines whether the given player is controlled by an AI.
 *
 * @param player - The PlayerState instance to check.
 * @returns True if the player has a non-null aiStrategy (i.e., is an AI player), otherwise false.
 */
export function isAIPlayer(player: PlayerState): boolean {
  return player.aiStrategy !== null;
}


/**
 * Represents the state of a pending or current action in the game.
 *
 * This interface is used to track which card is being played or discarded,
 * and optionally, which player is the target of the action (for cards that target opponents).
 *
 * @property cardId - The unique identifier of the card involved in the action.
 * @property targetId - (Optional) The unique identifier of the target player, if the action targets another player.
 */
export interface ActionState {
  cardId: string;
  targetId?: string;
}

/**
 * Creates a new ActionState object.
 *
 * @param cardId - The ID of the card involved in the action.
 * @param targetId - (Optional) The ID of the target player, if applicable.
 * @returns A new ActionState object.
 */
export function createActionState(cardId: string, targetId?: string): ActionState {
  return { cardId, ...(targetId ? { targetId } : {}) };
}


/**
 * Represents the complete state of the game at any given moment.
 *
 * This interface encapsulates all information required to describe the current
 * status of the game, including the deck, discard pile, all players, turn order,
 * any pending or current action, and the event log.
 *
 * @property deck - The array of Card objects remaining in the draw pile.
 * @property discard - The array of Card objects that have been discarded.
 * @property players - The array of PlayerState objects representing all players in the game.
 * @property turnIndex - The index of the player whose turn it is (corresponds to the players array).
 * @property actionState - (Optional) The current or pending action being performed, if any.
 * @property events - The array of GameEvent objects representing the history of actions/events in the game.
 */
export interface GameState {
  deck: Card[];
  discard: Card[];
  players: PlayerState[];
  turnIndex: number;
  actionState?: ActionState | null;
  events: GameEvent[];
}

/**
 * Retrieves a player from the game state by their unique ID.
 *
 * This function searches the list of players in the provided GameState
 * and returns the PlayerState object that matches the given playerId.
 * If no player with the specified ID is found, it returns null.
 *
 * @param gameState - The current state of the game containing all players.
 * @param playerId - The unique identifier of the player to retrieve.
 * @returns The PlayerState object for the specified player, or null if not found.
 */
export function getPlayerById(gameState: GameState, playerId: string): PlayerState | null
{
    const player = gameState.players.find(p => p.id === playerId);
    return player || null;
}

/**
 * Retrieves the current player from the game state based on the turn index.
 *
 * This function returns the PlayerState object for the player whose turn it is,
 * as determined by the turnIndex property of the provided GameState.
 *
 * @param gameState - The current state of the game.
 * @returns The PlayerState object for the current player.
 */
export function getCurrentPlayer(gameState: GameState): PlayerState
{
    if (
        !gameState ||
        !Array.isArray(gameState.players) ||
        typeof gameState.turnIndex !== 'number' ||
        gameState.turnIndex < 0 ||
        gameState.turnIndex >= gameState.players.length
    ) {
        throw new Error('Invalid game state');
    }
    return gameState.players[gameState.turnIndex];
}

/**
 * Retrieves the index of a player within the GameState's players array.
 *
 * This function searches for the player in the GameState by matching the player's id.
 * If the player is found, it returns the index; otherwise, it returns -1.
 *
 * @param player - The PlayerState object representing the player to find.
 * @param gameState - The GameState object containing the list of players.
 * @returns The index of the player in the GameState's players array, or -1 if not found.
 */
export function getPlayerIndex(player: PlayerState, gameState: GameState): number {
    if (!player || !gameState || !Array.isArray(gameState.players)) {
        return -1;
    }
    return gameState.players.findIndex(p => p.id === player.id);
}


/**
 * Retrieves a card from a player's hand by its unique ID.
 *
 * This function searches the player's hand for a card with the specified ID
 * and returns the card instance if found. If no such card exists in the hand,
 * it returns null.
 *
 * @param player - The PlayerState object representing the player whose hand to search.
 * @param cardId - The unique identifier of the card to retrieve.
 * @returns The Card object from the player's hand with the specified ID, or null if not found.
 */
export function getCardFromHand(player: PlayerState, cardId: string): Card | null
{
    if (!player || !Array.isArray(player.hand))
        throw new Error('Invalid player or hand');
    const card = player.hand.find(c => c.id === cardId);
    return card || null;
}




/**
 * Checks if the player has a green light.
 *
 * This function determines whether the player has a green light card in play.
 *
 * @param player - The PlayerState object representing the player to check.
 * @returns True if the player has a green light, false otherwise.
 */
export function hasGreenLight(player: PlayerState): boolean {
    return player.inPlay.progress.some(isGreenLight);
}

export function isGreenLight(card: Card): boolean {
  return card.name === GREEN_LIGHT_NAME;
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
    return gameState.players.filter((p) => p.id !== player.id);
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

