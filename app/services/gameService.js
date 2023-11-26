'use strict';

const Game = require('../classes/game');
const Player = require('../classes/player');
const LOGGER = require('./logger');


class GameService {
    #games = [];

    createGame() {
        let newlength =  this.#games.push(
            {
                game: null,
                players: [],
                started: false
            }
        );
        let gameId = newlength - 1;
        LOGGER.info(`GameService.createGame: Created new game with Id ${gameId}`);
        return gameId;
    }

    addPlayer(gameId, name) {
        if(gameId < 0 || gameId >= this.#games.length){
            LOGGER.error(`GameService.addPlayer: Game with Id ${gameId} not found`);
            return null;
        }

        let game = this.#games[gameId];

        if(game.started){
            LOGGER.error(`GameService.addPlayer: Game with Id ${gameId} has already started`);
            return null;
        }

        let id = game.players.push(new Player(name)) - 1;


        LOGGER.info(`GameService.addPlayer: Added player ${name} to game ${gameId}, playerId: ${id}`);
        return id;
    }

    getGameStatus(gameId) {
        if(gameId < 0 || gameId >= this.#games.length){
            LOGGER.error(`GameService.getGameStatus: Game with Id ${gameId} not found`);
            return null;
        }

        let game = this.#games[gameId];

        LOGGER.info(`GameService.getGameStatus: succesfully retreived gamestatus for id ${gameId}`);

        let result = {
            started: game.started,
            players: [],
            gameState: null
        }

        for(let i = 0; i < game.players.length; i++){
            result.players.push(game.players[i].name);
        }

        if(game.started){
            result.gameState = game.game.getState();
        }

        return result;
    }
    
    startGame(gameId) {
        if(gameId < 0 || gameId >= this.#games.length){
            LOGGER.error(`GameService.startGame: Game with Id ${gameId} not found`);
            return null;
        }

        let game = this.#games[gameId];

        if(game.started){
            LOGGER.error(`GameService.startGame: Game with Id ${gameId} has already started`);
            return null;
        }

        if(game.players.length < 2){
            LOGGER.error(`GameService.startGame: Game with Id ${gameId} has not enough players. Currently: ${game.players.length}`);
            return null;
        }

        game.game = new Game(game.players);
        game.started = true;
        LOGGER.info(`GameService.startGame: started game ${gameId}`);

        return game.game.getState();
    }

    selectOpenCards(gameId, playerId, cards){
        let game = this.#getGame(gameId);
        if(!game) {
            return null;
        }
        return game.game.selectOpenCards(playerId, cards);
    }
    playCard(gameId, playerId, cards){
        let game = this.#getGame(gameId);
        if(!game) {
            return null;
        }
        return game.game.playCard(playerId, cards);
    }
    drawPlayedStack(gameId, playerId){
        let game = this.#getGame(gameId);
        if(!game) {
            return null;
        }
        return game.game.drawPlayedStack(playerId);
    }
    playOpenCard(gameId, playerId, card){
        let game = this.#getGame(gameId);
        if(!game) {
            return null;
        }
        return game.game.playOpenCard(playerId, card);
    }
    playClosedCard(gameId, playerId, cardId){
        let game = this.#getGame(gameId);
        if(!game) {
            return null;
        }
        return game.game.playClosedCard(playerId, cardId)
    }

    #getGame(gameId){
        if(gameId < 0 || gameId >= this.#games.length){
            LOGGER.error(`GameService.#getGame: Game with Id ${gameId} not found`);
            return null;
        }

        let game = this.#games[gameId];

        if(!game.started){
            LOGGER.error(`GameService.#getGame: Game with Id ${gameId} has not started yet`);
            return null;
        }
        return game;
    }
    

};

module.exports = new GameService();