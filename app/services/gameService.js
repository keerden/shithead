'use strict';

const Game = require('../classes/game');
const Player = require('../classes/player');
const LOGGER = require('./logger');


class GameService {
    #gameInfo = [];

    createGame() {
        let newlength =  this.#gameInfo.push(
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
        if(gameId < 0 || gameId >= this.#gameInfo.length){
            LOGGER.error(`GameService.addPlayer: Game with Id ${gameId} not found`);
            return null;
        }

        let info = this.#gameInfo[gameId];

        if(info.started){
            LOGGER.error(`GameService.addPlayer: Game with Id ${gameId} has already started`);
            return null;
        }

        let id = info.players.push(new Player(name)) - 1;


        LOGGER.info(`GameService.addPlayer: Added player ${name} to game ${gameId}, playerId: ${id}`);
        return id;
    }

    getGameStatus(gameId) {
        if(gameId < 0 || gameId >= this.#gameInfo.length){
            LOGGER.error(`GameService.getGameStatus: Game with Id ${gameId} not found`);
            return null;
        }

        let info = this.#gameInfo[gameId];

        LOGGER.info(`GameService.getGameStatus: succesfully retreived gamestatus for id ${gameId}`);

        let result = {
            started: info.started,
            players: [],
            gameState: null
        }

        for(let i = 0; i < info.players.length; i++){
            result.players.push(info.players[i].name);
        }

        if(info.started){
            result.gameState = info.game.getState();
        }

        return result;
    }

    setGameStatus(gameId, status) {
        if(gameId < 0 || gameId >= this.#gameInfo.length){
            LOGGER.error(`GameService.getGameStatus: Game with Id ${gameId} not found`);
            return null;
        }

        let info = this.#gameInfo[gameId];

        info.started = status.started;
        info.players = [];
        for(let i = 0; i < status.players.length; i++){
            info.players.push(new Player(status.players[i]));
        }

        if(status.gameState !== null){
            info.game = new Game(info.players);
            info.game.setState(status.gameState);
        }else{
            info.game = null;
        }

       

        return this.getGameStatus(gameId);
    }
    
    startGame(gameId) {
        if(gameId < 0 || gameId >= this.#gameInfo.length){
            LOGGER.error(`GameService.startGame: Game with Id ${gameId} not found`);
            return null;
        }

        let info = this.#gameInfo[gameId];

        if(info.started){
            LOGGER.error(`GameService.startGame: Game with Id ${gameId} has already started`);
            return null;
        }

        if(info.players.length < 2){
            LOGGER.error(`GameService.startGame: Game with Id ${gameId} has not enough players. Currently: ${info.players.length}`);
            return null;
        }

        info.game = new Game(info.players);
        info.started = true;
        LOGGER.info(`GameService.startGame: started game ${gameId}`);

        return info.game.getState();
    }

    selectOpenCards(gameId, playerId, cards){
        let info = this.#getGame(gameId);
        if(!info) {
            return null;
        }
        return info.game.selectOpenCards(playerId, cards);
    }
    playCard(gameId, playerId, cards){
        let info = this.#getGame(gameId);
        if(!info) {
            return null;
        }
        return info.game.playCard(playerId, cards);
    }
    drawPlayedStack(gameId, playerId){
        let info = this.#getGame(gameId);
        if(!info) {
            return null;
        }
        return info.game.drawPlayedStack(playerId);
    }
    playOpenCard(gameId, playerId, card){
        let info = this.#getGame(gameId);
        if(!info) {
            return null;
        }
        return info.game.playOpenCard(playerId, card);
    }
    playClosedCard(gameId, playerId, cardId){
        let info = this.#getGame(gameId);
        if(!info) {
            return null;
        }
        return info.game.playClosedCard(playerId, cardId)
    }

    #getGame(gameId){
        if(gameId < 0 || gameId >= this.#gameInfo.length){
            LOGGER.error(`GameService.#getGame: Game with Id ${gameId} not found`);
            return null;
        }

        let info = this.#gameInfo[gameId];

        if(!info.started){
            LOGGER.error(`GameService.#getGame: Game with Id ${gameId} has not started yet`);
            return null;
        }
        return info;
    }
    
};

module.exports = new GameService();