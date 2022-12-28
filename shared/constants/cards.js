"use strict";

const CARD_TYPES = {
    CLUBS_ACE: '1C',
    HEARTS_ACE: '1H',
    SPADES_ACE: '1S',
    DIAMONTS_ACE: '1D',

    CLUBS_2: '2C',
    HEARTS_2: '2H',
    SPADES_2: '2S',
    DIAMONTS_2: '2D',

    CLUBS_3: '3C',
    HEARTS_3: '3H',
    SPADES_3: '3S',
    DIAMONTS_3: '3D',

    CLUBS_4: '4C',
    HEARTS_4: '4H',
    SPADES_4: '4S',
    DIAMONTS_4: '4D',

    CLUBS_5: '5C',
    HEARTS_5: '5H',
    SPADES_5: '5S',
    DIAMONTS_5: '5D',

    CLUBS_6: '6C',
    HEARTS_6: '6H',
    SPADES_6: '6S',
    DIAMONTS_6: '6D',

    CLUBS_7: '7C',
    HEARTS_7: '7H',
    SPADES_7: '7S',
    DIAMONTS_7: '7D',

    CLUBS_8: '8C',
    HEARTS_8: '8H',
    SPADES_8: '8S',
    DIAMONTS_8: '8D',

    CLUBS_9: '9C',
    HEARTS_9: '9H',
    SPADES_9: '9S',
    DIAMONTS_9: '9D',

    CLUBS_10: '0C',
    HEARTS_10: '0H',
    SPADES_10: '0S',
    DIAMONTS_10: '0D',
    
    CLUBS_JACK: 'JC',
    HEARTS_JACK: 'JH',
    SPADES_JACK: 'JS',
    DIAMONTS_JACK: 'JD',   

    CLUBS_QUEEN: 'QC',
    HEARTS_QUEEN: 'QH',
    SPADES_QUEEN: 'QS',
    DIAMONTS_QUEEN: 'QD',   

    CLUBS_KING: 'KC',
    HEARTS_KING: 'KH',
    SPADES_KING: 'KS',
    DIAMONTS_KING: 'KD', 
    
    JOKER: '**',
    JOKER_SPECIAL: '##'
}

module.exports = Object.freeze({
    CARD_TYPES
});