"use strict";

const CRYPTO = require('crypto');


class Deck {
    #set = [];
    constructor(deck) {
        if(Array.isArray(deck)){
            this.#set = [...deck];
            return;
        }

        if(deck instanceof Deck){
            this.#set = deck.getAll();
        }
    }

    shuffle() {
        for (let i = this.#set.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          let tmp = this.#set[i];
          this.#set[i] = this.#set[j];
          this.#set[j] = tmp;
        }
      }

    add(card) {
        return this.#set.push(card) - 1;
    }

    has(card) {
        return (this.#set.indexOf(card) !== -1);
    }

    remove(index){
        let result = this.#set.splice(index, 1);
        return result.length ? result[0] : null;
    }

    removeValue(value){
        let i = this.#set.indexOf(value);
        if(i === -1){
            return null;
        }
        return this.remove(i);
    }

    getAll(){
        return [...this.#set];
    }

    size() {
        return this.#set.length;
    }

    deal(numPiles, pileSize){
        let exhausted = false;
        let piles = new Array(numPiles);
        for(let i = 0; i < pileSize; i++){
            for(let j = 0; j < numPiles; j++){
                if(i == 0) {
                    piles[j] = new Deck();
                }
                if(this.#set.length === 0){
                    exhausted = true;
                    break;
                }
                piles[j].add(this.#set.pop());
            }   
        }

        return {piles, exhausted};
    }

};


module.exports = Deck;