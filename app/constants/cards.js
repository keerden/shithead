"use strict";

const CARD_TYPES = require('../../shared/constants/cards').CARD_TYPES;

const DEFAULT_DECK = [...Object.values(CARD_TYPES), CARD_TYPES.JOKER, CARD_TYPES.JOKER];

module.exports = Object.freeze({
    CARD_TYPES,
    DEFAULT_DECK
});