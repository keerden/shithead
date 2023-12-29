"use strict";
const Card = require('../models/card');
const CRYPTO = require('crypto');


class Deck {
    #set = [];
    constructor(deck) {
        if(Array.isArray(deck)){
            this.#set =  deck.map((card) => Card.generateCode(card));
            return;
        }

        if(deck instanceof Deck){
            this.#set = deck.getAllCodes();
        }
    }

    shuffle() {
        for (let i = this.#set.length - 1; i > 1; i--) {
          let j = CRYPTO.randomInt(i + 1);
          let tmp = this.#set[i];
          this.#set[i] = this.#set[j];
          this.#set[j] = tmp;
        }
      }

    add(card) {
        let code = Card.generateCode(card);
        if(!code){
            return null;
        }
        return this.#set.push(code) - 1;
    }

    addCode(code) {
        return this.#set.push(code) - 1;
    }

    concat(cards) {
        if(cards instanceof Deck){
            this.#set = this.#set.concat(cards.getAllCodes());
            return;
        }

        let codes = cards.map((card) => Card.generateCode(card));
        this.#set = this.#set.concat(codes);
    }

    has(card) {
        let code = Card.generateCode(card);
        if(!code){
            return null;
        }
        return (this.#set.indexOf(code) !== -1);
    }

    clear(){
        this.#set = [];
    }

    remove(index){
        let result = this.#set.splice(index, 1);
        return result.length ? Card.fromCode(result[0]) : null;
    }

    pop(){
        let result = this.#set.pop();
        return result ? Card.fromCode(result) : null;
    }

    removeCard(card){
        let code = Card.generateCode(card);
        if(code === null){
            return null;
        }

        let i = this.#set.indexOf(code);
        if(i === -1){
            return null;
        }
        return this.remove(i);
    }

    getAll(){
        let result = [...this.#set]

        return result.map((x) => Card.fromCode(x));
    }

    getAllCodes(){
        return [...this.#set];
    }

    size() {
        return this.#set.length;
    }

    empty() {
        return this.#set.length === 0;
    }

    last() {
        if(this.empty()){
            return null;
        }
        let code = this.#set[this.#set.length - 1];
        return Card.fromCode(code)
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
                piles[j].addCode(this.#set.pop());
            }   
        }

        return {piles, exhausted};
    }

    toJSON() {
        return this.getAll();
    }

};


module.exports = Deck;