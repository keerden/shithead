'use strict';

const ROOMNAME = 'mainRoom';
const RoomClass = require('../classes/room');
const LOGGER = require('../services/logger');
const RESPONSES = require('../responses/responses');
const ROOM = new RoomClass(ROOMNAME);


exports.init = function(io) {
    io.on('connection', onConnection);
}


exports.setHandler = function (socket, eventname, handler){
    return socket.on(eventname, async function(param, callBack){
        let result = handler(socket, param);
        if(typeof callBack === 'function'){
            //if result is promise, await it;
            try {
                if(result && typeof result.then === 'function') { 
                    result = await result;
                }
            } catch (err){
                LOGGER.error(`Error while handling event '${eventname}'. Error: ${err}`)
                result = RESPONSES.serverError();
            } finally {
                callBack(result);
            }
        }
    });
}





/**
 * Whenever a client connects
 * @function
 * @param {Socket} socket Client socket
 */
function onConnection(socket) {
    //check remaining free sockets, otherwise disconnect

    
    LOGGER.info(`sockets.onConnection: socket ${socket.id} is connected`);
  
    exports.setHandler(socket, 'enterGame', ROOM.enter.bind(ROOM));
    exports.setHandler(socket, 'startGame', ROOM.startGame.bind(ROOM));
  
    /**
     * Whenever someone is performing a disconnection,
     * leave its room and notify to the rest
     * @method
     */
    socket.on('disconnecting', function(reason) {
        LOGGER.info(`sockets.disconnecting: socket ${socket.id} is going to disconnect. reason: ${reason}`);
        ROOM.leave(socket);
    });

    socket.on('disconnect', function(reason) {
        LOGGER.info(`sockets.disconnect socket ${socket.id} is going to disconnect. reason: ${reason}`);
      //  ROOM.leave(socket);
    });
}
  