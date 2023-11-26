'use strict';

const GAME_SERVICE = require('../services/gameService');
const RESPONSES = require('../responses/responses');
const Card = require('../models/card');

class ShitheadController {
    createGame(req, res) {
        let gameId = GAME_SERVICE.createGame();

        RESPONSES.ok(req, res, {gameId});
    }

    addPlayer(req, res){
        let gameId = req.params.gameId;
        let name = req.body.name;

        let playerId = GAME_SERVICE.addPlayer(gameId, name);
        if(playerId){
            RESPONSES.ok(req, res, {playerId});
        } else {
            RESPONSES.badRequest(req,res);
        }
    }
    
    addPlayer(req, res){
        let gameId = req.params.gameId;
        let name = req.body.name;

        let playerId = GAME_SERVICE.addPlayer(gameId, name);
        if(playerId === null){
            RESPONSES.badRequest(req,res);
            return;
        }
        RESPONSES.ok(req, res, {playerId});
    }

    getGameStatus(req, res) {
        let gameId = req.params.gameId;

        let status = GAME_SERVICE.getGameStatus(gameId);
        if(status){
            RESPONSES.ok(req, res, status);
        } else {
            RESPONSES.badRequest(req,res);
        } 
    }

    startGame(req, res) {
        let gameId = req.params.gameId;

        let status = GAME_SERVICE.startGame(gameId);
        if(status){
            RESPONSES.ok(req, res, status);
        } else {
            RESPONSES.badRequest(req,res);
        } 
    }

    playerAction(req, res){
        let gameId = req.params.gameId;
        let playerId = req.params.playerId;
        let action = req.body.action;

        let response = null;

console.log(req.body)



        switch(action){
            case "selectOpenCards":
                response = GAME_SERVICE.selectOpenCards(gameId, playerId, req.body.cards);
                break;
            case "playCard":
                response = GAME_SERVICE.playCard(gameId, playerId, req.body.cards);
                break;            
            case "drawPlayedStack":
                response = GAME_SERVICE.drawPlayedStack(gameId, playerId);
                break;
            case "playOpenCard":
                response = GAME_SERVICE.playOpenCard(gameId, playerId, req.body.card);
                break;
            case "playClosedCard":
                response = GAME_SERVICE.playClosedCard(gameId, playerId, req.body.cardId);
                break;             
        }

        if(response){
            RESPONSES.ok(req, res, response);
        } else {
            RESPONSES.badRequest(req,res);
        }
    }

};

module.exports = new ShitheadController();