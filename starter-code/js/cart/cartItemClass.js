class CartItem {
    #id;
    #quantity;

    constructor({id, quantity}) {
        this.#id = id;
        this.#quantity = quantity;
    }

    get id() {
        return this.#id;
    }

    get quantity() {
        return this.#quantity;
    }

    // setters
    set id(id) {
        this.#id = id;
    }

    set quantity(quantity) {
        this.#quantity = quantity;
    }
}