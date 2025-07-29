/**
 * @file This file contains unit tests for the core game logic in game.ts.
 * It uses the Jest testing framework to verify the correctness of functions
 * related to player state, turn management, and game initialization.
 */

import {
    createInitialGameState,
    applyCardToPlayer,
    advanceTurn,
    checkWinCondition,
    type PlayerConfig,
    playCard,
    TARGET_DISTANCE,
} from './game';
import * as deck from './deck';
import type {
    Card,
    GameState,
    PlayerState
} from '../types';
import {
    GREEN_LIGHT_NAME,
    RED_LIGHT_NAME,
    ACCIDENT_NAME,
    REPAIR_NAME,
    PROGRESS_100_KM_NAME,
    DRIVING_ACE_NAME,
    createRemedyCard,
    createProgressCard,
    createBlockCard,
    createImmunityCard,
    getPlayerById,
    SPARE_TIRE_NAME,
    FLAT_TIRE_NAME,
    PROGRESS_50_KM_NAME,
    // SPEED_LIMIT_NAME,
} from '../types';
import { FULL_DECK } from './cards';

// Mock the shuffle function to ensure predictable deck order for tests
jest.spyOn(deck, 'shuffle').mockImplementation(cards => cards);

/**
 * Helper function to create a base game state for testing.
 * 
 * @param playerCount - The number of players to initialize in the game (default is 2).
 * @returns A new GameState object with the specified number of players, each with an initial hand.
 */
function createBaseState(playerCount: number = 2): GameState {
    const playerConfigs: PlayerConfig[] = Array.from({ length: playerCount }, () => ({ aiStrategy: null }));
    return createInitialGameState(playerConfigs);
}

describe('Game Logic', () => {
    it('should create an initial game state correctly', () => {
        const playerConfigs: PlayerConfig[] = [{ aiStrategy: null }, { aiStrategy: null }];
        const state = createInitialGameState(playerConfigs);
        expect(state.players.length).toBe(2);
        expect(state.deck.length).toBe(FULL_DECK.length - state.players.length * 5);
        state.players.forEach(player => {
            expect(player.hand.length).toBe(5);
        });
    });

    it('should handle different player counts', () => {
        for (let playerCount = 2; playerCount <= 4; playerCount++) {
            const playerConfigs: PlayerConfig[] = Array.from({ length: playerCount }, () => ({ aiStrategy: null }));
            const state = createInitialGameState(playerConfigs);
            expect(state.players.length).toBe(playerCount);
            // Assert that all player IDs are unique
            const playerIds = state.players.map(p => p.id);
            const uniquePlayerIds = new Set(playerIds);
            expect(uniquePlayerIds.size).toBe(playerIds.length);
        }
    });

    it('should throw an error if player count is less than 2 or greater than 4', () => {
        // Test for less than 2 players
        expect(() => {
            createInitialGameState([]);
        }).toThrow();

        expect(() => {
            createInitialGameState([{ aiStrategy: null }]);
        }).toThrow();

        // Test for more than 4 players
        const tooManyPlayers = Array.from({ length: 5 }, () => ({ aiStrategy: null }));
        expect(() => {
            createInitialGameState(tooManyPlayers);
        }).toThrow();
    });



    it('should apply a progress card correctly', () => {
        let state = createBaseState();
        let player = state.players[0];
        const progressCard = FULL_DECK.find(c => c.name === '100km')!;
        const greenLightCard = FULL_DECK.find(c => c.name === GREEN_LIGHT_NAME)!;

        // Give player a green light first
        player.hand = [greenLightCard, progressCard];
        player = applyCardToPlayer(player, greenLightCard);

        const updatedPlayer = applyCardToPlayer(player, progressCard);
        expect(updatedPlayer.totalKm).toBe(100);
        expect(updatedPlayer.inPlay.progress).toContain(progressCard);
    });

    it('should not apply a progress card if player is blocked', () => {
        const state = createBaseState();
        let player = state.players[0];
        const progressCard = FULL_DECK.find(c => c.name === '100km')!;
        const blockCard = FULL_DECK.find(c => c.name === RED_LIGHT_NAME)!;

        player = applyCardToPlayer(player, blockCard); // Player is now blocked

        const updatedPlayer = applyCardToPlayer(player, progressCard);
        expect(updatedPlayer.totalKm).toBe(0); // Should not increase
        expect(updatedPlayer.inPlay.progress).not.toContain(progressCard);
        expect(updatedPlayer.inPlay.blocks).toContain(blockCard);
    });

    it('should apply a block card to an opponent', () => {
        const state = createBaseState();
        const opponent = state.players[1];
        const blockCard = FULL_DECK.find(c => c.name === ACCIDENT_NAME)!;

        const updatedOpponent = applyCardToPlayer(opponent, blockCard);
        expect(updatedOpponent.inPlay.blocks).toContain(blockCard);
    });

    it('should apply a remedy card to remove a block', () => {
        const state = createBaseState();
        let player = state.players[0];
        const blockCard = FULL_DECK.find(c => c.name === ACCIDENT_NAME)!;
        player = applyCardToPlayer(player, blockCard); // Player is blocked

        const remedyCard = FULL_DECK.find(c => c.name === REPAIR_NAME)!;
        const updatedPlayer = applyCardToPlayer(player, remedyCard);

        expect(updatedPlayer.inPlay.blocks).not.toContain(blockCard);
        expect(updatedPlayer.inPlay.immunities).not.toContain(remedyCard);
        expect(updatedPlayer.inPlay.progress).not.toContain(remedyCard);
    });

    it('should apply an immunity card', () => {
        const state = createBaseState();
        const player = state.players[0];
        const immunityCard = FULL_DECK.find(c => c.name === DRIVING_ACE_NAME)!;
        const updatedPlayer = applyCardToPlayer(player, immunityCard);

        expect(updatedPlayer.inPlay.immunities).toContain(immunityCard);
    });

    it('should advance the turn correctly', () => {
        let state = createBaseState(2);
        expect(state.turnIndex).toBe(0);
        state = advanceTurn(state);
        expect(state.turnIndex).toBe(1);
        state = advanceTurn(state);
        expect(state.turnIndex).toBe(0);

        // Test advanceTurn for 3 players
        let state3 = createBaseState(3);
        expect(state3.turnIndex).toBe(0);
        state3 = advanceTurn(state3);
        expect(state3.turnIndex).toBe(1);
        state3 = advanceTurn(state3);
        expect(state3.turnIndex).toBe(2);
        state3 = advanceTurn(state3);
        expect(state3.turnIndex).toBe(0);

        // Test advanceTurn for 4 players
        let state4 = createBaseState(4);
        expect(state4.turnIndex).toBe(0);
        state4 = advanceTurn(state4);
        expect(state4.turnIndex).toBe(1);
        state4 = advanceTurn(state4);
        expect(state4.turnIndex).toBe(2);
        state4 = advanceTurn(state4);
        expect(state4.turnIndex).toBe(3);
        state4 = advanceTurn(state4);
        expect(state4.turnIndex).toBe(0);
    });

    it('should declare a winner correctly', () => {
        const state = createBaseState();
        state.players[0].totalKm = TARGET_DISTANCE;
        const winner = checkWinCondition(state);
        expect(winner).toBe(state.players[0]);
    });

    it('should not declare a winner if no one has reached 1000km', () => {
        const state = createBaseState(2);
        state.players[0].totalKm = 500;
        state.players[1].totalKm = 999;
        const winner = checkWinCondition(state);
        expect(winner).toBeNull();
    });
});

describe('playCard', () => {

    it('should return the original state if given a non-existent card id', () => {
        const initialState = createBaseState(2);
        const originalState = JSON.parse(JSON.stringify(initialState)); // deep copy for comparison

        const resultState = playCard(initialState, 'non-existent-card-id');

        // Should return the exact same object (reference equality)
        expect(resultState).toBe(initialState);

        // Should not mutate the original state
        expect(initialState).toEqual(originalState);
    });

    it("should remove a progress card from the player's hand and add it to the discard pile", () => {

        const PROGRESS_CARD_ID = 'p100';
        const progressCard = createProgressCard(PROGRESS_CARD_ID, PROGRESS_100_KM_NAME);
        const greenLightCard = createRemedyCard('gl1', GREEN_LIGHT_NAME);

        let initialState = createBaseState(2);
        // Manually setup player state for the test
        const player = initialState.players[0];
        player.hand.push(progressCard);
        player.inPlay.progress.push(greenLightCard);
        player.isReady = true;

        const initialHandSize = player.hand.length;

        const finalState = playCard(initialState, progressCard.id);
        const finalPlayer = finalState.players[0];

        expect(finalState).not.toBe(initialState);
        expect(finalPlayer.hand.length).toBe(initialHandSize - 1);
        expect(finalPlayer.hand.find((c: Card) => c.id === PROGRESS_CARD_ID)).toBeUndefined();
        expect(finalState.discard.find((c: Card) => c.id === PROGRESS_CARD_ID)).toBeDefined();
        expect(finalPlayer.totalKm).toBe(100);
        expect(finalState.events[0].message).toContain('played 100km');
    });

    it('should apply a block card to an opponent', () => {
        const BLOCK_CARD_ID = 'b1';
        const blockCard = createBlockCard(BLOCK_CARD_ID, RED_LIGHT_NAME);

        let initialState = createBaseState(2);
        const player1Id = initialState.players[0].id;
        const player2Id = initialState.players[1].id;
        initialState.players[0].hand.push(blockCard);

        const finalState = playCard(initialState, blockCard.id, player2Id);
        const player1 = finalState.players.find(p => p.id === player1Id)!;
        const player2 = finalState.players.find(p => p.id === player2Id)!;

        expect(player1.hand.find((c: Card) => c.id === BLOCK_CARD_ID)).toBeUndefined();
        expect(finalState.discard.find((c: Card) => c.id === BLOCK_CARD_ID)).toBeDefined();
        expect(player2.inPlay.blocks[0].id).toBe(BLOCK_CARD_ID);
        expect(finalState.events[0].message).toContain('played Red Light on Player 2');
    });

it('should apply an immunity card to the player and prevent future blocks of that type', () => {
        const IMMUNITY_CARD_ID = 'im1';
        const BLOCK_CARD_ID = 'b2';
        const immunityCard = createImmunityCard(IMMUNITY_CARD_ID, DRIVING_ACE_NAME);
        const blockCard = createBlockCard(BLOCK_CARD_ID, ACCIDENT_NAME);

        let initialState = createBaseState(2);
        const player1Id = initialState.players[0].id;

        // Give player 1 the immunity card
        initialState.players[0].hand.push(immunityCard);

        // Player 1 plays the immunity card
        let stateAfterImmunity = playCard(initialState, immunityCard.id);

        // const player1AfterImmunity = stateAfterImmunity.players.find(p => p.id === player1Id)!;
        const player1AfterImmunity = getPlayerById(stateAfterImmunity, player1Id);
        expect(player1AfterImmunity).not.toBeNull();
        if (!player1AfterImmunity) throw new Error('Player 1 not found');
        expect(player1AfterImmunity.hand.find((c: Card) => c.id === IMMUNITY_CARD_ID)).toBeUndefined();
        expect(stateAfterImmunity.discard.find((c: Card) => c.id === IMMUNITY_CARD_ID)).toBeDefined();
        expect(player1AfterImmunity.inPlay.immunities.some((c: Card) => c.id === IMMUNITY_CARD_ID)).toBe(true);
        expect(stateAfterImmunity.events[0].message).toContain('played Driving Ace');
        expect(stateAfterImmunity.turnIndex).toBe(0); // playCard should not advance turn

        // Advance turn manually
        stateAfterImmunity = advanceTurn(stateAfterImmunity);
        expect(stateAfterImmunity.turnIndex).toBe(1);

        // Now, player 2 tries to play a block of the same type on player 1
        stateAfterImmunity.players[1].hand.push(blockCard);
        stateAfterImmunity.actionState = { cardId: blockCard.id, targetId: player1Id };
        const stateAfterBlock = playCard(stateAfterImmunity, blockCard.id, player1Id);

        const player1AfterBlock = getPlayerById(stateAfterBlock, player1Id);
        expect(player1AfterBlock).not.toBeNull();
        if (!player1AfterBlock) throw new Error('Player 1 not found');
        // The block should not be applied due to immunity
        expect(player1AfterBlock.inPlay.blocks.find((c: Card) => c.id === BLOCK_CARD_ID)).toBeUndefined();
        // The block card should still be discarded
        expect(stateAfterBlock.discard.find((c: Card) => c.id === BLOCK_CARD_ID)).toBeDefined();
        // There should be an event indicating the block was prevented
        expect(stateAfterBlock.events[0].message).toMatch(/tried to play/i);
    });

    it('should allow a progress card to be played after a remedy card removes a block', () => {
        const REMEDY_CARD_ID = 'r1';
        const BLOCK_CARD_ID = 'b3';
        const PROGRESS_CARD_ID = 'p1';

        // Create cards
        const blockCard = createBlockCard(BLOCK_CARD_ID, FLAT_TIRE_NAME);
        const remedyCard = createRemedyCard(REMEDY_CARD_ID, SPARE_TIRE_NAME);
        const progressCard = createProgressCard(PROGRESS_CARD_ID, PROGRESS_100_KM_NAME);
        const greenLightCard = createRemedyCard('gl1', GREEN_LIGHT_NAME);
        // Set up initial state: player 1 is blocked with Flat Tire and has remedy and progress in hand, and also has a green light
        let initialState = createBaseState(2);
        const player1Id = initialState.players[0].id;
        initialState.players[0].inPlay.blocks.push(blockCard);
        initialState.players[0].hand.push(remedyCard, progressCard);
        initialState.players[0].inPlay.progress.push(greenLightCard);
        initialState.players[0].isReady = true;
        
        // Player 1 plays the remedy card to remove the block
        let stateAfterRemedy = playCard(initialState, remedyCard.id);

        const player1AfterRemedy = getPlayerById(stateAfterRemedy, player1Id);
        expect(player1AfterRemedy).not.toBeNull();
        if (!player1AfterRemedy) throw new Error('Player 1 not found');
        // Block should be removed
        expect(player1AfterRemedy.inPlay.blocks.find((c: Card) => c.id === BLOCK_CARD_ID)).toBeUndefined();
        // Remedy should be in discard
        expect(stateAfterRemedy.discard.find((c: Card) => c.id === REMEDY_CARD_ID)).toBeDefined();
        // Progress card should still be in hand
        expect(player1AfterRemedy.hand.find((c: Card) => c.id === PROGRESS_CARD_ID)).toBeDefined();

        // It's now player 2's turn, so give progress card to player 2 and play it, or advance turn back to player 1
        // For this test, let's simulate player 1's next turn by setting turnIndex back to player 0
        stateAfterRemedy.turnIndex = 0;

        // Player 1 plays the progress card
        let stateAfterProgress = playCard(stateAfterRemedy, progressCard.id);

        const player1AfterProgress = getPlayerById(stateAfterProgress, player1Id);
        expect(player1AfterProgress).not.toBeNull();
        if (!player1AfterProgress) throw new Error('Player 1 not found');
        // Progress card should be in discard
        expect(stateAfterProgress.discard.find((c: Card) => c.id === PROGRESS_CARD_ID)).toBeDefined();
        // Player's progress should be updated (should have the progress card in inPlay.progress)
        expect(player1AfterProgress.inPlay.progress.find((c: Card) => c.id === PROGRESS_CARD_ID)).toBeDefined();
        // There should be an event indicating the progress card was played
        expect(stateAfterProgress.events[0].message).toContain('played 100km');
    });
});

describe('applyCardToPlayer', () => {
    let basePlayer: PlayerState;
    const greenLightCard = createRemedyCard('gl', GREEN_LIGHT_NAME);

    beforeEach(() => {
        const initialState = createBaseState();
        basePlayer = initialState.players[0];
    });

    // Test cases for PROGRESS_TYPE cards
    describe('Progress Cards', () => {
        const progressCard = createProgressCard('p100', PROGRESS_100_KM_NAME);

        it('should add progress card to inPlay and increase totalKm if player has green light and is not blocked', () => {
            let player = applyCardToPlayer(basePlayer, greenLightCard);
            player = applyCardToPlayer(player, progressCard);

            expect(player.totalKm).toBe(100);
            expect(player.inPlay.progress).toContain(progressCard);
        });

        it('should not apply progress card if player does not have green light', () => {
            const player = applyCardToPlayer(basePlayer, progressCard);

            expect(player.totalKm).toBe(0);
            expect(player.inPlay.progress).not.toContain(progressCard);
        });

        it('should not apply progress card if player is blocked', () => {
            const blockCard = createBlockCard('b1', RED_LIGHT_NAME);
            let player = applyCardToPlayer(basePlayer, greenLightCard);
            player = applyCardToPlayer(player, blockCard);
            const finalPlayer = applyCardToPlayer(player, progressCard);

            expect(finalPlayer.totalKm).toBe(0);
            expect(finalPlayer.inPlay.progress).not.toContain(progressCard);
        });

        it('should throw an error if a progress card has no value', () => {
            const invalidProgressCard = { ...createProgressCard('p-invalid', PROGRESS_50_KM_NAME), value: undefined };
            let player = applyCardToPlayer(basePlayer, greenLightCard);
            expect(() => applyCardToPlayer(player, invalidProgressCard)).toThrow('Invalid state: progress card has no value');
        });
    });

    // Test cases for REMEDY_TYPE cards
    describe('Remedy Cards', () => {
        it('should add Green Light to progress and remove a Stop block', () => {
            const stopBlock = createBlockCard('stop', RED_LIGHT_NAME);
            let player = applyCardToPlayer(basePlayer, stopBlock);
            expect(player.inPlay.blocks).toContain(stopBlock);

            player = applyCardToPlayer(player, greenLightCard);

            expect(player.inPlay.progress).toContain(greenLightCard);
            expect(player.inPlay.blocks).not.toContain(stopBlock);
        });

        it('should add Green Light to progress even if not blocked', () => {
            const player = applyCardToPlayer(basePlayer, greenLightCard);
            expect(player.inPlay.progress).toContain(greenLightCard);
            expect(player.inPlay.blocks.length).toBe(0);
        });

        it('should remove the corresponding block for a non-Green-Light remedy', () => {
            const accidentBlock = createBlockCard('acc', ACCIDENT_NAME);
            const repairRemedy = createRemedyCard('rep', REPAIR_NAME);
            let player = applyCardToPlayer(basePlayer, accidentBlock);
            expect(player.inPlay.blocks).toContain(accidentBlock);

            player = applyCardToPlayer(player, repairRemedy);

            expect(player.inPlay.blocks).not.toContain(accidentBlock);
        });
    });

    // Test cases for BLOCK_TYPE cards
    describe('Block Cards', () => {
        it('should add a block card to the player inPlay blocks', () => {
            const blockCard = createBlockCard('b1', ACCIDENT_NAME);
            const player = applyCardToPlayer(basePlayer, blockCard);

            expect(player.inPlay.blocks).toContain(blockCard);
        });
    });

    // Test cases for IMMUNITY_TYPE cards
    describe('Immunity Cards', () => {
        it('should add an immunity card to the player inPlay immunities', () => {
            const immunityCard = createImmunityCard('im1', DRIVING_ACE_NAME);
            const player = applyCardToPlayer(basePlayer, immunityCard);

            expect(player.inPlay.immunities).toContain(immunityCard);
        });
    });

    // Test cases for isReady status update
    describe('isReady status', () => {
        it('should set isReady to true when player has green light and is not blocked', () => {
            const player = applyCardToPlayer(basePlayer, greenLightCard);
            expect(player.isReady).toBe(true);
        });

        it('should set isReady to false when player does not have green light', () => {
            expect(basePlayer.isReady).toBe(false);
        });

        it('should set isReady to false when player is blocked', () => {
            const blockCard = createBlockCard('b1', RED_LIGHT_NAME);
            let player = applyCardToPlayer(basePlayer, greenLightCard);
            player = applyCardToPlayer(player, blockCard);

            expect(player.isReady).toBe(false);
        });

        it('should set isReady to true after a block is remedied', () => {
            const blockCard = createBlockCard('b1', RED_LIGHT_NAME);
            const remedyCard = createRemedyCard('r1', GREEN_LIGHT_NAME); // Green light also remedies stop
            let player = applyCardToPlayer(basePlayer, blockCard);
            player = applyCardToPlayer(player, remedyCard); // This first green light is consumed by the remedy

            player = applyCardToPlayer(player, greenLightCard); // This second green light makes the player ready

            expect(player.isReady).toBe(true);
        });
    });
}); 