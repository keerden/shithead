"use strict";

class Player {
    name;
    socket;
    score;
    closedCards;
    openCards;
    handCards;

    constructor(name, socket) {
        this.score = 0;
        this.name = name;
        this.socket = socket;
        this.openCards = null;
        this.closedCards = null;
        this.handCards = null;;
    }



};


module.exports = Player;