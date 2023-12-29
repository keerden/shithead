"use strict";
const LOGGER = require('../services/logger');
const RULES = require('../../shared/constants/rules');
const GAME_CONSTANTS = require('../../shared/constants/gameContants');
const Player = require('./player');
const Deck = require('./deck');
const DefaultDeck = require('./defaultDeck');


class Game {
    #players = [];
    #fullDeck;
    #drawStack;
    #burnStack;
    #playedStack;
    #directionClockwise;
    #turn;
    #gameState;
    #readyCount;
    constructor(playerList) {
        this.#players = playerList;
        this.#fullDeck = new DefaultDeck();
        this.#burnStack = new Deck();
        this.#playedStack = new Deck();
        this.#drawStack = new Deck(this.#fullDeck);
        this.#drawStack.shuffle();
        this.#turn = 0;
        this.#directionClockwise = true;
        this.#gameState = GAME_CONSTANTS.GAME_STATES.SELECTING_OPEN_CARDS;
        this.#readyCount = 0;
        let closedCards = this.#drawStack.deal(this.#players.length, GAME_CONSTANTS.CLOSED_SIZE).piles;
        let handCards = this.#drawStack.deal(this.#players.length, GAME_CONSTANTS.MIN_HAND_SIZE + GAME_CONSTANTS.OPEN_SIZE).piles;

        for(let i = 0; i < this.#players.length; i++){
            this.#players[i].closedCards = closedCards[i];
            this.#players[i].handCards = handCards[i];
            this.#players[i].openCards = null;
        }
    }

    selectOpenCards(playerId, cards) {
        LOGGER.info(`Game.selectOpenCards: Selecting for player ${playerId}.`);

        if(playerId < 0 || playerId >= this.#players.length){
            LOGGER.error(`Game.selectOpenCards: Player ID not found: ${playerId}`);
            return null;
        }

        let player = this.#players[playerId];

        if(this.#gameState != GAME_CONSTANTS.GAME_STATES.SELECTING_OPEN_CARDS){
            LOGGER.warn(`Game.selectOpenCards: Player ${player.name} tried to select open cards while game has already started!`);
            return null;
        }

        if(player.openCards != null){
            LOGGER.warn(`Game.selectOpenCards: Player ${player.name} tried to change his open cards!`);
            return null;
        }

        if(!cards || cards.length !== GAME_CONSTANTS.OPEN_SIZE){
            LOGGER.warn(`Game.selectOpenCards: Player ${player.name} did not provide the righ amount of cards!`);
            return null;
        }

        let newHand = new Deck(player.handCards);
        for(const card of cards){
            console.log(`Selecting`, card);
            if(!newHand.removeCard(card)){
                LOGGER.warn(`Game.selectOpenCards: Player ${player.name} has chosen cards that are not in his hand!`);
                return null;
            }
        }

        player.openCards = new Deck(cards);
        player.handCards = newHand;
        this.#readyCount++;
        if(this.#readyCount == this.#players.length){
            this.#gameState = GAME_CONSTANTS.GAME_STATES.PLAYING;
            LOGGER.info(`Game.selectOpenCards: All players have selected their cards, gamestate changed to playing.`);
        }

        LOGGER.info(`Game.selectOpenCards: Player ${player.name} succesfully selected cards.`);
        return this.getState();
    }

    playCard(playerId, cards){
        LOGGER.info(`Game.playCard: Player ${playerId} plays ${cards}.`);

        if(playerId < 0 || playerId >= this.#players.length){
            LOGGER.error(`Game.playCard: Player ID not found: ${playerId}`);
            return null;
        }

        let player = this.#players[playerId];

        if(this.#gameState != GAME_CONSTANTS.GAME_STATES.PLAYING){
            LOGGER.warn(`Game.playCard: Player ${player.name} tried to play cards while the game has not started yet!`);
            return null;
        }

        if(this.#turn != playerId){
            LOGGER.warn(`Game.playCard: Player ${player.name} tried to play cards before its turn!`);
            return null;
        }

        let newHand = new Deck(player.handCards);
        for(const card of cards){
            console.log(`checking`, card);
            if(!newHand.removeCard(card)){
                LOGGER.warn(`Game.playCard: Player ${player.name} tried to play a card that is not in his hand!`);
                return null;
            }
        }

        if(!this.#performPlay(cards)){
            LOGGER.warn(`Game.playCard: Player ${player.name} tried to play an invalid move!`);
            return null;
        }

        if(newHand.size() < GAME_CONSTANTS.MIN_HAND_SIZE){
            let cardsNeeded = GAME_CONSTANTS.MIN_HAND_SIZE - newHand.size();
            if(cardsNeeded > this.#drawStack.size()){
                cardsNeeded = this.#drawStack.size();
            }

            for(let i = 0; i < cardsNeeded; i++){
                let newCard =  this.#drawStack.pop();
                newHand.add(newCard);
                LOGGER.info(`Game.playCard: Player ${playerId} draws ${newCard} from drawstack.`);
            }
        }
        player.handCards = newHand;
        return this.getState();
    }

    drawPlayedStack(playerId){
        LOGGER.info(`Game.drawPlayedStack: Player ${playerId} draws the played stack.`);

        if(playerId < 0 || playerId >= this.#players.length){
            LOGGER.error(`Game.drawPlayedStack: Player ID not found: ${playerId}`);
            return null;
        }

        let player = this.#players[playerId];

        if(this.#gameState != GAME_CONSTANTS.GAME_STATES.PLAYING){
            LOGGER.warn(`Game.drawPlayedStack: Player ${player.name} tried to draw the played stack while the game has not started yet!`);
            return null;
        }

        if(this.#turn != playerId){
            LOGGER.warn(`Game.playCard: Player ${player.name} tried to draw the played stack before its turn!`);
            return null;
        }

        if(this.#playedStack.empty()){
            LOGGER.warn(`Game.playCard: Player ${player.name} tried to draw the played stack while its empty!`);
            return null;
        }        


        player.handCards.concat(this.#playedStack);
        this.#playedStack.clear();
        this.#nextTurn();
        return this.getState();
    }

    playOpenCard(playerId, card){
        LOGGER.info(`Game.playOpenCard: Player ${playerId} plays open card ${card}.`);

        if(playerId < 0 || playerId >= this.#players.length){
            LOGGER.error(`Game.playOpenCard: Player ID not found: ${playerId}`);
            return null;
        }

        let player = this.#players[playerId];

        if(this.#gameState != GAME_CONSTANTS.GAME_STATES.PLAYING){
            LOGGER.warn(`Game.playOpenCard: Player ${player.name} tried to play card while the game has not started yet!`);
            return null;
        }

        if(this.#turn != playerId){
            LOGGER.warn(`Game.playOpenCard: Player ${player.name} tried to play card before its turn!`);
            return null;
        }

        if(!player.handCards.empty()){
            LOGGER.warn(`Game.playOpenCard: Player ${player.name} tried to play open card while his hand is not empty!`);
            return null;
        }

        let newOpenCards = new Deck(player.openCards);

        console.log(`Selecting ${card}`);
        if(!newOpenCards.removeCard(card)){
            LOGGER.warn(`Game.playOpenCard: Player ${player.name} tried to play a card that is not in his open cards!`);
            return null;
        }        

        if(!this.#performPlay([card])){
            LOGGER.warn(`Game.playOpenCard: Player ${player.name} tried to play an invalid move!`);
            return null;
        }

        player.openCards = newOpenCards;
        return this.getState();
    }

    playClosedCard(playerId, cardId){
        LOGGER.info(`Game.playClosedCard: Player ${playerId} plays closed card ${cardId}.`);

        if(playerId < 0 || playerId >= this.#players.length){
            LOGGER.error(`Game.playClosedCard: Player ID not found: ${playerId}`);
            return null;
        }

        let player = this.#players[playerId];

        if(this.#gameState != GAME_CONSTANTS.GAME_STATES.PLAYING){
            LOGGER.warn(`Game.playClosedCard: Player ${player.name} tried to play card while the game has not started yet!`);
            return null;
        }

        if(this.#turn != playerId){
            LOGGER.warn(`Game.playClosedCard: Player ${player.name} tried to play card before its turn!`);
            return null;
        }

        if(!player.handCards.empty()){
            LOGGER.warn(`Game.playClosedCard: Player ${player.name} tried to play open card while his hand is not empty!`);
            return null;
        }

        if(!player.openCards.empty()){
            LOGGER.warn(`Game.playClosedCard: Player ${player.name} tried to play open card while he has open cards!`);
            return null;
        }

        if(cardId < 0 || cardId >= player.openCards.size()){
            LOGGER.warn(`Game.playClosedCard: Player ${player.name} tried to play a closed card he does not have!`);
            return null;
        }        

        let card = player.closedCards.remove(cardId);
        LOGGER.info(`Game.playClosedCard: Player ${playerId} reveals card ${card}.`);


        let isValid = !this.#performPlay([card]);

        if(!isValid){
            LOGGER.info(`Game.playClosedCard: Player ${player.name} is unable to play this card, drawing stack`);
            this.drawPlayedStack(playerId);
        } else {
            if(player.closedCards.empty()){
                LOGGER.info(`Game.playClosedCard: Player ${player.name} won the game!`);
                this.#gameState = GAME_CONSTANTS.GAME_STATES.FINSIHED;
            }
        }

        return this.getState();
    }


    #performPlay(cards) {
        let isBurn = false;
        let card = cards[0];

        //verify if cards are the same
        for(let i = 1; i < cards.length; i++){
            if(cards[i].value != card.value){
                LOGGER.warn(`Game.performPlay: Invalid combination of cards!`);
                return false;
            }
        }


        //check if we are allowed to play these cards
        if(!this.#playedStack.empty()){
            let lastPlayed = this.#playedStack.last();
            let allowed = RULES.getAllowedNext(lastPlayed.value);
            if(!allowed || !allowed.includes(card.value)){
                LOGGER.warn(`Game.performPlay: The card ${card} is not allowed on ${lastPlayed}`);
                return false;
            }
        }

        //check if we are going to burn this round
        if(cards.length >= GAME_CONSTANTS.BURN_AMOUNT || card.value === 10){
            isBurn = true;
        } else {
            let neededToBurn = GAME_CONSTANTS.BURN_AMOUNT - cards.length; 
            if(this.#playedStack.size() >= neededToBurn){
                let playedCards = this.#playedStack.getAll();
                isBurn = true;
                for(let i = 0; i < neededToBurn; i++){
                    if(playedCards[this.#playedStack.size() - i - 1].value != card.value){
                        isBurn = false;
                        break;
                    }
                }
            }
        }

        //check if we need to turn around
        if(card.value === 1 && (cards.length % 2) === 1) {
            this.#directionClockwise = !this.#directionClockwise;
        }

        if(isBurn){
            LOGGER.info(`Game.performPlay: burning the stack`);
            this.#burnStack.concat(this.#playedStack);
            this.#burnStack.concat(cards);
            this.#playedStack.clear();
        } else {
            this.#playedStack.concat(cards);
            this.#nextTurn();
        }

        return true;

    }

    getState() {

        return {
            fullDeck: this.#fullDeck,
            playedStack: this.#playedStack,
            drawStack: this.#drawStack,
            burnStack: this.#burnStack,
            turn: this.#turn,
            gameState:  this.#gameState,
            directionClockwise: this.#directionClockwise,
            players: this.#players
        };
    }

    setState(state){
        this.#fullDeck = new Deck(state.fullDeck);
        this.#playedStack = new Deck(state.playedStack);
        this.#drawStack = new Deck(state.drawStack);
        this.#burnStack = new Deck(state.burnStack);
        this.#turn = state.turn;
        this.#gameState = state.gameState;
        this.#directionClockwise = state.directionClockwise;
        this.#players = [];

            for(let i = 0; i < state.players.length; i++){
                let player = new Player(state.players[i].name);
                if(state.players[i].handCards !== null){
                    player.handCards = new Deck(state.players[i].handCards);
                }
                if(state.players[i].openCards !== null){
                    player.openCards = new Deck(state.players[i].openCards);
                }
                if(state.players[i].closedCards !== null){
                    player.closedCards = new Deck(state.players[i].closedCards);
                }              
                this.#players.push(player);
            }
        
    }

    #nextTurn() {
        this.#turn += this.#directionClockwise ? 1 : -1;

        if(this.#turn < 0){
            this.#turn = this.#players.length - 1;
        }

        if(this.#turn >=  this.#players.length){
            this.#turn = 0;
        }
    }

};

module.exports = Game;