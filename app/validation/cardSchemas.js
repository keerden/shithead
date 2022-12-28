'use strict';
const GAME_CONSTANTS = require('../../shared/constants/gameContants');
const CARDS = require('../constants/cards');



const OPEN_CARDS = {
    type: "array",
    minItems: GAME_CONSTANTS.OPEN_SIZE,
    maxItems: GAME_CONSTANTS.OPEN_SIZE,
    items: {
        type: "string",
        enum: Object.values(CARDS.CARD_TYPES)
    }
};

module.exports = Object.freeze({
    OPEN_CARDS
});