import {productData} from "../main.js";
import {CartItem} from "./cartItemClass.js";

export class Cart {
  #cart;

  constructor() {
    const cartLocalStorage = this.localStorageCart;

    if (Array.isArray(cartLocalStorage)) {
      // this makes sure that we convert all of the plain object instances in the localstorage array are of the object type CartItem after we pull it from localStorage
      this.#cart = cartLocalStorage.map(
        cartItem => new CartItem({
          id: cartItem.id,
          quantity: cartItem.quantity
        })
      );
    } else {
      this.#cart = [];
    }

    // start with an empty cart in local storage when the page first loads
    if (!cartLocalStorage) {
      this.localStorage = this.#cart;
    }
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

  addNewItem(cartItem) {
    if (cartItem instanceof CartItem) {
      this.#cart.push(cartItem);
    }

    console.log(this.#cart);
    this.localStorageCart = this.#cart;
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
    const matchingProduct = this.#cart.find(cartItem => cartItem.id === id);
    console.log(matchingProduct);
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

  get localStorageCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }

  set localStorageCart(cart) {
    console.log("Writing to localStorage", cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}