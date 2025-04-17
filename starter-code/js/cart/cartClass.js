class Cart {
  #cart;

  constructor() {
    this.#cart = [];
  }

  addCartItem(cartItem) {
    if (cartItem instanceof cartItemClass) {
      const matchingItem = this.#cart.find(item => item.id === cartItem.id);
      if (matchingItem) {
        console.log("productFound");
        matchingItem.quantity += cartItem.quantity;
        console.log(cart);
      } else {
        console.log("adding new item to cart");
        this.#cart.push(cartItem);
      }
    }
  }
}