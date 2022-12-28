'use strict' 

const express = require('express');
const APP = express();
const HTTP = require('http').Server(APP);
const {Server: SOCKETIO} = require("socket.io");
const port = process.env.PORT || 3000;

const SOCKETS = require('./app/routes/socket');
const LOGGER = require('./app/services/logger');



let io = new SOCKETIO(HTTP, {pingInterval: 5000, pingTimeout: 5000});


SOCKETS.init(io);
APP.use(express.static(__dirname + '/public'));
APP.use('/lib' , express.static(__dirname + '/shared'));
HTTP.listen(port, () => console.log('listening on port ' + port));

LOGGER.info("Server started");







