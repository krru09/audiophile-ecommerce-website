  export class CartItem {
  #id;
  #quantity;

  constructor({id, quantity = 1}) {
    this.#id = id;
    this.#quantity = quantity;
  }

  toJSON() {
    return {
      id: this.#id,
      quantity: this.#quantity
    }
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

  incrementQuantity() {
    this.#quantity += 1;
  }

  decrementQuantity() {
    this.#quantity > 1 ? this.#quantity -= 1 : this.#quantity = 1;
  }
}