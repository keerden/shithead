'use strict';

class Logger {
    constructor() {

    }

    log(level, msg) {
        console.log(`${level}: ${msg}`);
    }

    debug(msg) {
        this.log('DEBUG', msg);
    }

    info(msg) {
        this.log('INFO', msg);
    }
    warn(msg) {
        this.log('WARNING', msg);
    }
    error(msg) {
        this.log('ERROR', msg);
    }
};

module.exports = new Logger();