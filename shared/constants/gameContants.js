const GAME_STATES = {
    SELECTING_OPEN_CARDS: 'selectOpenCards',
    PLAYING: 'playing'
};

const CLOSED_SIZE = 3;
const OPEN_SIZE = 3;
const MIN_HAND_SIZE = 3;

module.exports = Object.freeze({
    GAME_STATES,
    MIN_HAND_SIZE,
    OPEN_SIZE,
    CLOSED_SIZE
});