'use strict';

class Card {
    value;
    suit;

    constructor(value, suit){
        this.value = value;
        this.suit = suit;

    }

    toCode() {
        return Card.generateCode(this);
    }

    static fromCode(code) {
        if(typeof code !== 'string' && code != ""){
            return null;
        }
        let parts = code.split('_', 2);

        let value = parseInt(parts[0]);
        let suit = (parts.length === 2) ? parts[1] : null;
        return new Card(value, suit);
    }

    static generateCode(obj) {
        if(obj.suit !== null){
            return obj.value + "_" + obj.suit;
        }

        return String(obj.value);

    }

}

module.exports = Card;