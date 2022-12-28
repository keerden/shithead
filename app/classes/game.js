"use strict";
const LOGGER = require('../services/logger');
const SOCKETS = require('../routes/socket');
const RESPONSES = require('../responses/responses');
const CARDS = require('../constants/cards');
const GAME_CONSTANTS = require('../../shared/constants/gameContants');
const AJV = require('../validation/ajv');
const Player = require('./player');
const Deck = require('./deck');


class Game {
    #players = [];
    #deck;
    #drawStack;
    #burnStack;
    #playedStack;
    #directionClockwise;
    #turn;
    #gameState;
    #readyCount;
    constructor(playerList) {
        this.#directionClockwise = true;
        this.#players = playerList;
        this.#deck = new Deck(CARDS.DEFAULT_DECK);
        this.#burnStack = new Deck();
        this.#playedStack = new Deck();
        this.#drawStack = new Deck(this.#deck);
        this.#drawStack.shuffle();
        this.#turn = 0;
        this.#gameState = GAME_CONSTANTS.GAME_STATES.SELECTING_OPEN_CARDS;
        this.#readyCount = 0;


        //todo: check deck size

        let closedCards = this.#drawStack.deal(this.#players.length, GAME_CONSTANTS.CLOSED_SIZE).piles;
        let handCards = this.#drawStack.deal(this.#players.length, GAME_CONSTANTS.MIN_HAND_SIZE + GAME_CONSTANTS.OPEN_SIZE).piles;
        for(let i = 0; i < this.#players.length; i++){
            let player = this.#players[i];
            player.closedCards = closedCards[i];
            player.handCards = handCards[i];

            if(!player.socket){
                continue;
            }
            player.socket.data.Game = this;
            player.socket.data.playerId = i;
            SOCKETS.setHandler(player.socket, 'chooseCards', this.#eventChooseCards.bind(this));
            SOCKETS.setHandler(player.socket, 'playUserHand', this.#eventPlayUserHand.bind(this));
            SOCKETS.setHandler(player.socket, 'playOpen', this.#eventPlayOpen.bind(this));
            SOCKETS.setHandler(player.socket, 'playClosed', this.#eventPlayClosed.bind(this));
            SOCKETS.setHandler(player.socket, 'drawCard', this.#eventDrawCard.bind(this));
            SOCKETS.setHandler(player.socket, 'drawPlayed', this.#eventDrawPlayed.bind(this));
            SOCKETS.setHandler(player.socket, 'interrupt', this.#eventInterrupt.bind(this));
            SOCKETS.setHandler(player.socket, 'getState', this.#eventGetState.bind(this));
        }
        this.#sendState('gameStarted');
    }

    leave(socket) {
        
    }

    #eventChooseCards(socket, cards) {
        LOGGER.info('Game.eventChooseCards: Selecting.');

        if(typeof socket?.data?.playerId ===  'undefined' || socket.data.playerId >= this.#players.length){
            LOGGER.error('Player ID not found, but eventhandler set on socket');
            return RESPONSES.serverError();
        }

        // if(!AJV.validateOpenCards(cards)) {
        //     //return RESPONSES.badRequest("Invalid parameter provided!");
        // }

        let player = this.#players[socket.data.playerId];

        if(player.openCards){
            LOGGER.warn('Player has already chosen cards')
            return RESPONSES.badRequest("Cards are already set.");
        }

        let newHand = new Deck(player.handCards);
        for(const card of cards){
            console.log(`Selecting ${card}`);
            if(!newHand.removeValue(card)){
                LOGGER.warn('Player has chosen cards that are not in his hand!')
                return RESPONSES.badRequest("Cannot choose cards that are not in your hand!");
            }
        }

        player.openCards = new Deck(cards);
        player.handCards = newHand;
        this.#readyCount++;
        if(this.#readyCount == this.#players.length){
            this.#gameState = GAME_CONSTANTS.GAME_STATES.PLAYING;
            this.#sendState('gameStarted');
        }

        LOGGER.info(`Game.eventChooseCards: Player ${player.name} selected cards.`);
        return RESPONSES.ok();
    }

    #eventPlayUserHand () {

    }
    #eventPlayOpen () {

    }

    #eventPlayClosed() {

    }

    #eventDrawCard () {

    }

    #eventDrawPlayed() {

    }
    #eventInterrupt() {

    }
    #eventGetState() {

    }


    #sendState(eventName) {

        let state = {
            fullDeck: this.#deck.getAll(),
            directionClockwise: this.#directionClockwise,
            turn: this.#turn,
            drawStackSize: this.#drawStack.size(),
            burnStackSize: this.#burnStack.size(),
            playedStack: this.#playedStack.getAll(),
            players: this.#getPlayerData(),
        };

        for(let i = 0; i < this.#players.length; i++){
            const player = this.#players[i];
            if(!player.socket){
                continue;
            }

            let userState = {
                ...state,
                openCards: (player.openCards === null) ? [] : player.openCards.getAll(),
                closedCards: (player.closedCards === null) ? 0 : player.closedCards.size(),
                handCards: (player.handCards === null) ? [] : player.handCards.getAll(),
                playerId: i
            }

            player.socket.emit(eventName, userState);
        }

    }

    #getPlayerData() {
        let data = [];
        for(const player of this.#players){
            data.push({
                name: player.name,
                handCount: (player.handCards === null) ? 0 : player.handCards.size(),
                closedCount: (player.closedCards === null) ? 0 : player.closedCards.size(),
                openCards: (player.openCards === null) ? [] : player.openCards.getAll()
            });
        }

        return data;
    }
};

module.exports = Game;