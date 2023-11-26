'use strict';

const SOCKET_ACK_TIMEOUT_MS = process.env.SOCKET_ACK_TIMEOUT_MS || 5000;

const EXPRESS = require('express');
const HTTP = require('http');
const LOGGER = require('../services/logger');
const RESPONSES =  require('../responses/responses');
const SOCKET_IO = require("socket.io");

let io = null;
let app = null;
let server = null;

/**
 * Initializes the (public) socket.io server on the given port.
 * A separate express instance is created to add extra endpoints to this server.
 *
 * @param {*} port the port to use
 */
exports.init = function (port) {
    app = EXPRESS();
    server = HTTP.createServer(app);

    io = new SOCKET_IO.Server(server, {pingInterval: 5000, pingTimeout: 5000});

    //The following middleware is executed for each new connection.
    //When the middelware fails, the connection will not be opened.
    //io.use(AUTH.authorizeSocket);

    //The following event handles a connected socket that has passed the middleware checks.
    io.on('connect', onConnect);
    initRoutes(app);


    server.listen(port, () => LOGGER.info('Socket.io is listening on port ' + port));
}

/**
 * Closes the socket.io server
 */
exports.close = async function () {
    if(server){
        LOGGER.info('Closing Socket.io');
        //TODO: Better handling
        io.close();
    }
}


/**
 * This function defines the additional public routes on the socket-server
 *
 * @param {*} app express app instance
 */
function initRoutes(app) {

    app.route('/running')
        .get(RESPONSES.running.bind(RESPONSES))
        .all(RESPONSES.methodNotAllowed.bind(RESPONSES));


    // if(TEST_MODE){
    //     app.use('/test', EXPRESS.static(__dirname + '/../../test'));
    // }

    app.route('*')
        .all(RESPONSES.endpointNotFound.bind(RESPONSES));
}

/**
 * Whenever a client connects
 *
 * Defines event listeners for this socket
 *
 * @function
 * @param {Socket} socket Client socket
 */
function onConnect(socket) {
    LOGGER.info(`[${socket.id}] onConnect: Socket is connected with type: '${socket.data.type}'.`);

    //disconnecting handler, executed before disconnecting and before leaving rooms
    socket.on('disconnecting', function (reason) {
        LOGGER.info(`[${socket.id}] socket.disconnecting: Socket is going to disconnect. reason: ${reason}`);
    });

    //disconnect handler, executed before disconnecting and after leaving rooms
    socket.on('disconnect', function (reason) {
        LOGGER.info(`[${socket.id}] socket.disconnect: Socket is going to disconnect. reason: ${reason}`);
    });

    /**
     * custom events that are emitted by clients can be defined here
     */

    // socket.on('customEventName', (data) => {
    //     doSomething(data);
    // });
}

/**
 * Broadcast an event to all sockets of the given type
 *
 * @param {*} type type to broadcast to
 * @param {*} event name of event to broadcast
 * @param {*} data additional data to emit
 */
exports.broadcastToType = async function (type, event, data) {
    LOGGER.info(`broadcastToType: Broadcasting '${event}' to sockets with type: '${type}'`);
    let sockets = await getSocketsByType(type);

    if (!sockets.length) {
        LOGGER.warning(`broadcastToType: No sockets found for type '${type}'`);
    }

    for (const socket of sockets) {
        socket.emit(event, data);
    }
}


/**
 * Emits an event to a given socket and waits for the ack.
 * When no response had been received within the time defined by
 * SOCKET_ACK_TIMEOUT, an error will be thrown.
 *
 * @param {*} id            id of the socket to emit an event to
 * @param {*} event         Name of the event to emit
 * @param {*} data          Data to be sent to the socket
 * @returns                 response from socket
 * @throws                  on error or timeout
 */
exports.emitToId = async function (id, event, data) {
    let socket = await getSocketById(id);
    if (socket === null) {
        throw new Error(`Socket not found for id: ${id}`);
    }
    LOGGER.info(`emitToId: Emitting '${event}' to id [${id}]`);
    return socket.timeout(SOCKET_ACK_TIMEOUT_MS).emitWithAck(event, data);
}

/**
 * Find all sockets associated to the given client type
 *
 * @param {*} type type to search for
 * @returns array of sockets. Empty array when no sockets are found.
 * @throws on socket.io errors
 */
async function getSocketsByType(type) {
    let sockets = await io.fetchSockets();
    let result = [];

    for (const socket of sockets) {
        if (socket.type === type) {
            result.push(socket);
        }
    }

    return result;
}


/**
 * Find socket by id
 *
 * @param {*} id socket.io id of the socket
 * @returns socket. Null when socket is not found.
 * @throws on socket.io errors
 */

async function getSocketById(id) {
    let sockets = await io.fetchSockets();
    let result = null;

    for (const socket of sockets) {
        if (socket.id === id) {
            result = socket;
            break;
        }
    }

    return result;
}
