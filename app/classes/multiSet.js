'use strict';

class MultiSet {
    #map;
    #size;
    constructor(array = []) {
        this.#map = new Map();
        this.#size = 0;
        this.#setSize();
        for(const element of array){
            this.add(element);
        }
    }

    add(element) {
        let count = 1;
        let existing = this.#map.get(element);
        if(existing){
            count += existing;
        }
        this.#map.set(element, count);
        this.#size++;
        return this;
    }

    clear() {
        this.#map.clear();
        this.#size = 0;
    }

    delete(element) {
        let existing = this.#map.get(element);
        if(!existing){
            return false;
        }
        if(existing === 1){
            this.#map.delete(element);
        } else {
            existing--;
            this.#map.set(element, existing);
        }
        this.#size--;
        return true;
    }

    has(element){
        let existing = this.#map.get(element);
        return (existing !== undefined);
    }

    count(element){
        let existing = this.#map.get(element);
        if (!existing){
            return 0;
        }
        return existing;
    }

    keys() {
        return this.#map.keys();
    }

    #setSize() {
        Object.defineProperty(this, 'size', {
            get() {
              return this.#size;
            },
            set(_value){
                return;
            }
        });
    }
    
}

module.exports = MultiSet;