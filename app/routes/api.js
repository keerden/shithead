'use strict';

const BODY_PARSER = require('body-parser');
const EXPRESS = require('express');
const HTTP = require('http');
const LOGGER = require('../services/logger');
const RESPONSES = require('../responses/responses');

const MORGAN = require('morgan');


const SHITHEAD_CONTROLLER = require('../controllers/shitheadController');

let app = null;
let server = null;


exports.init = function (port, baseUrl) {
    app = EXPRESS();
    server = HTTP.createServer(app);

    app.use(MORGAN('combined'));
    app.use(BODY_PARSER.urlencoded({extended: true }));
    app.use(BODY_PARSER.json({extended: true}));
    initRoutes(app, baseUrl);

    server.listen(port, () => LOGGER.info(`API is listening on port ${port}`));
}


exports.close = async function(){
    return new Promise((resolve, reject) => {
        if(server){
            server.close(() => {
                LOGGER.info('Closed all remaining API connections.');
                resolve(true);
            });
        } else {
            reject("not initialized")
        }
    });
}


function initRoutes(app, baseUrl) {

    app.route(baseUrl + '/running')
        .get(RESPONSES.running.bind(RESPONSES))
        .all(RESPONSES.methodNotAllowed.bind(RESPONSES));

    app.route(baseUrl + '/game')
        .post(SHITHEAD_CONTROLLER.createGame.bind(SHITHEAD_CONTROLLER))
        .all(RESPONSES.methodNotAllowed.bind(RESPONSES));

    app.route(baseUrl + '/game/:gameId')
        .get(SHITHEAD_CONTROLLER.getGameStatus.bind(SHITHEAD_CONTROLLER))
        .put(SHITHEAD_CONTROLLER.setGameStatus.bind(SHITHEAD_CONTROLLER))
        .all(RESPONSES.methodNotAllowed.bind(RESPONSES));
 
    app.route(baseUrl + '/game/:gameId/start')
        .post(SHITHEAD_CONTROLLER.startGame.bind(SHITHEAD_CONTROLLER))
        .all(RESPONSES.methodNotAllowed.bind(RESPONSES));    

    app.route(baseUrl + '/game/:gameId/players')
        //.get(SHITHEAD_CONTROLLER.getAllPlayers)
        .post(SHITHEAD_CONTROLLER.addPlayer.bind(SHITHEAD_CONTROLLER))
        .all(RESPONSES.methodNotAllowed.bind(RESPONSES));


    app.route(baseUrl + '/game/:gameId/players/:playerId/action')
        .post(SHITHEAD_CONTROLLER.playerAction.bind(SHITHEAD_CONTROLLER))
        .all(RESPONSES.methodNotAllowed.bind(RESPONSES));

    app.route('*')
        .all(RESPONSES.endpointNotFound.bind(RESPONSES));
}