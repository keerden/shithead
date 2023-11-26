const GAME_STATES = {
    SELECTING_OPEN_CARDS: 'selectOpenCards',
    PLAYING: 'playing',
    FINSIHED: 'finished'
};

const CLOSED_SIZE = 3;
const OPEN_SIZE = 3;
const MIN_HAND_SIZE = 3;
const BURN_AMOUNT = 4;

module.exports = Object.freeze({
    GAME_STATES,
    MIN_HAND_SIZE,
    OPEN_SIZE,
    CLOSED_SIZE,
    BURN_AMOUNT
});