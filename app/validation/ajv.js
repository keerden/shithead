"use strict";
const AJV = require('ajv');
const CARD_SCHEMAS = require('./cardSchemas');

const AJV_INSTANCE = new AJV();
const OPEN_CARDS_VALIDATOR = AJV_INSTANCE.compile(CARD_SCHEMAS.OPEN_CARDS);

exports.validateOpenCards = function (cards) {
    return OPEN_CARDS_VALIDATOR(cards);
}