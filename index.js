'use strict' 

const SOCKET_PORT = process.env.SOCKET_PORT ?? 3000;
const API_PORT = process.env.INTERNAL_API_PORT ?? 8080;
const GRACEFUL_SHUTDOWN_TIMER_IN_SECONDS = process.env.GRACEFUL_SHUTDOWN_TIMER_IN_SECONDS ?? 30;

const SOCKETS = require('./app/routes/sockets');
const API = require('./app/routes/api');
const LOGGER = require('./app/services/logger');


SOCKETS.init(SOCKET_PORT);
API.init(API_PORT, "");

async function stop() {
    //If server hasn't finished in time, shut down process
    setTimeout(() => {
        LOGGER.info(`stop: Closing connections took longer than ${GRACEFUL_SHUTDOWN_TIMER_IN_SECONDS} seconds, force shutting down.`);
        process.exit(0);
    }, (GRACEFUL_SHUTDOWN_TIMER_IN_SECONDS * 1000)).unref(); // Prevents the timeout from registering on event loop

    await API.close();
    await SOCKETS.close();
    process.exit(0);
}


process.on('SIGTERM', async () => {
    LOGGER.info('Received SIGTERM. Shutting down.');
    await stop();
});

process.on('SIGINT', async () => {
    LOGGER.info('Received SIGINT. Shutting down.');
    await stop();
});



   