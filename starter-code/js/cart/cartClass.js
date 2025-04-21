import {productData} from "../main.js";
import {CartItem} from "./cartItemClass.js";

export class Cart {
  #cart;

  constructor() {
    this.#cart = [
      new CartItem({id: 2, quantity: 2})
    ];
  }

  get totalItems() {
    let itemsQuantity = 0;
    if (this.#cart.length >= 1) {
      this.#cart.forEach(cartItem => {
        itemsQuantity += cartItem.quantity;
      });
    }

    return itemsQuantity;
  }

  get cart() {
    return [...this.#cart];
  }

  get length() {
    return this.#cart.length;
  }

  get totalPrice() {
    let totalPrice = 0;
    if (this.#cart.length > 0) {
      this.#cart.forEach(cartItem => {
        const matchingProduct = productData.find(product => product.id === cartItem.id)
        if (matchingProduct) {
          const productPrice = matchingProduct.price;
          totalPrice += (cartItem.quantity * productPrice);
        }
      });
    }

    return totalPrice;
  }

  addCartItem(cartItem) {
    if (cartItem instanceof CartItem) {
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

  removeAll() {
    this.#cart.splice(0, this.#cart.length);
  }

  removeProduct(id) {
    const matchingProduct = this.#cart.find(product => product.id === id);
    if (matchingProduct) {
      const productIndex = this.#cart.indexOf(matchingProduct);
  
      this.#cart.splice(productIndex, 1);
    }
  }

  findById(id) {
    return this.#cart.find(cartItem => cartItem.id === id);
  }

  incrementQuantity(id) {
    const matchingProduct = this.#cart.find(cart => cart.id === id);
    if (matchingProduct) {
      matchingProduct.incrementQuantity();
    }
  }

  decrementQuantity(id) {
    const matchingProduct = this.#cart.find(cart => cart.id === id);
    if (matchingProduct) {
      matchingProduct.decrementQuantity();
    }
  }
}