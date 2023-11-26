"use strict";

const Deck = require('./deck');
const Card = require('../models/card');
const {SUITS_ORDER } = require('../../shared/constants/rules');

class DefaultDeck extends Deck {
    constructor() {
        //generate default deck
        let newDeck = [];
        for(let i = 1; i < 14; i++){
            for(const suit of SUITS_ORDER){
                newDeck.push(new Card(i, suit));
            }
        }
        // jokers
        // newDeck.push(new Card(0, null));
        // newDeck.push(new Card(0, null));
        // newDeck.push(new Card(0, null));
        // newDeck.push(new Card(15, null));
        super(newDeck);

    }

};


module.exports = DefaultDeck;