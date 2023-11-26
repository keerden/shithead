"use strict";

const SUITS = Object.freeze
({
    CLUBS: 'C',
    HEARTS: 'H',
    SPADES: 'S',
    DIAMONDS: 'D'
});

const SUITS_ORDER = [SUITS.CLUBS, SUITS.HEARTS, SUITS.SPADES, SUITS.DIAMONDS];

// W = joker, S = special joker
const CARD_VALUES = ['W', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'S'];

/** map containing the allowed indices of cards. Jokers, 8's and 10's are missing because they work different */
const ALLOWED_NEXT =  new Map([
    [ 1, [0, 1, 2, 8, 15]], 
    [ 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]], 
    [ 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]],
    [ 4, [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]],
    [ 5, [0, 1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]],
    [ 6, [0, 1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14]],
    [ 7, [0, 2, 3, 4, 5, 6, 7, 8, 14]],
    [ 9, [9, 11, 12, 13, 14]], 
    [ 11, [0, 1, 2, 8, 11, 12, 13, 14]],
    [ 12, [0, 1, 2, 8, 12, 13, 14]],
    [ 13, [0, 1, 2, 8, 13, 14]]
]);

function isJoker(card){
    return card === 0 || card === 14;
}

function getAllowedNext(value){
    return ALLOWED_NEXT.get(value);
}

module.exports = Object.freeze({
    SUITS,
    SUITS_ORDER,
    CARD_VALUES,
    getAllowedNext
});