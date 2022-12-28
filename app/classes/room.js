"use strict";
const LOGGER = require('../services/logger');
const RESPONSES = require('../responses/responses');
const Player = require('./player');
const Game = require('./game');


const MAX_PLAYERS = 5;

class Room {
    #players;
    #game;
    #name;
    constructor(name) {
        this.#players = [];
        this.#game = null;
        this.#name = name;
    }

    enter(socket, playerName){
        LOGGER.debug(`Room.enter: Player ${playerName} is entering room ${this.#name}`);
        let player = this.#players.find(p => p.name === playerName);
  
        if(player){                     //does player exist?
            LOGGER.debug(`Room.enter: player already in room`);
            if(player.socket){
                LOGGER.warn(`Room.enter: player already connected`);
                socket.disconnect(true);    //unable to join, player already connected.
                return RESPONSES.badRequest("player already connected");
            }
            
            player.socket = socket;
            socket.join(this.#name);
            return RESPONSES.ok();
        }
    
        if(this.#game){ //game already started
            LOGGER.warn('Room.enter: Game already started');
            socket.disconnect(true);
            return RESPONSES.badRequest("Game already started");
        }

        if(this.#players.length >= MAX_PLAYERS){
            LOGGER.warn('Room.enter: Room is full');
            socket.disconnect(true);
            return RESPONSES.badRequest("Room is full");
        }
        
        //create new player
        player = new Player(playerName, socket);
        this.#players.push(player);
        socket.join(this.#name);
        socket.data.room = this;
        LOGGER.info(`Room.enter: Succesfully entered room ${this.#name}`);
        return RESPONSES.ok();
    }

    startGame(socket) {
        LOGGER.debug('Room.startGame: starting game');
        if(this.#players.length  === 0 || this.#players[0]?.socket?.id != socket.id){
            LOGGER.warn('Room.startGame: Only player 0 is allowed to start the game');
            return RESPONSES.forbidden("only player 0 is allowed to start game");
        }

        if(this.#game){
            LOGGER.warn('Room.startGame: Game is already started.');
            return RESPONSES.badRequest('Game already started');
        }

        this.#game = new Game(this.#players);
        LOGGER.info('Room.startGame: Game started.');
        return RESPONSES.ok();
    }

    leave(socket){
        if(this.#game){
            this.#game.leave(socket);
        }
        let player = this.#players.find(p => p?.socket?.id === socket.id);
        if(player){
            player.socket = null;
        }else{
            LOGGER.warn(`Room.leave: Socket ${socket.id} was not in this room!`);
        }
    }


};


module.exports = Room;