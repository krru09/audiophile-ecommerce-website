import {cart} from "./cart/cart.js";
import {productData} from "./main.js"

console.log(cart.cart);

export function headerEventListeners() {
  const hamburgerButton = document.getElementById("hamburger-button");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  hamburgerButton.addEventListener("click", () => {
    toggleModal(hamburgerMenu);
  });

  const cartButton = document.getElementById("cart-button");
  const cartMenu = document.getElementById("cart");
  cartButton.addEventListener("click", () => {
    toggleModal(cartMenu);
  });
}

export function toggleModal(modalContainer) {
  const backdrop = document.getElementById("backdrop");
  const cartModal = document.getElementById("cart");
  const hamburgerModal = document.getElementById("hamburger-menu");
  const allModals = document.querySelectorAll("dialog");

  if (modalContainer.classList.contains("hidden")) {
    modalContainer.classList.remove("hidden");
    backdrop.classList.remove("hidden");

    cartModal.classList.remove("highest-index");
    hamburgerModal.classList.remove("highest-index");
    modalContainer.classList.add("highest-index");
  } else {
    modalContainer.classList.add("hidden");
    if (hamburgerModal.classList.contains("hidden") && cartModal.classList.contains("hidden")) {
      backdrop.classList.add("hidden");
    }
  }
}

export function renderCartModal() {
  const cartButtonContainer = document.getElementById("cart-button-container");
  const cartProductsSection = document.getElementById("cart-products");

  // resets the cart modal products section so it always starts off as empty when called
  cartProductsSection.innerHTML = "";

  const cartTotalQuantity = cart.totalItems;
  console.log(cartTotalQuantity);

  const cartDialog = document.getElementById("cart");
  const cartQuantity = document.getElementById("cart-quantity");
  cartQuantity.textContent = cartTotalQuantity;

  // working with cart products section
  if (cart.length >= 1) {
    cart.cart.forEach(cartItem => {
      const matchingProduct = productData.find(product => product.id === cartItem.id);
      const matchingProductId = matchingProduct.id;

      const cartProduct = document.createElement("article");
      cartProduct.dataset.id = `${matchingProduct.id}`;
      cartProduct.className = "cart-product";
      cartProduct.innerHTML = `
          <div class="product-details-container" data-slug="${matchingProduct.slug}">
            <button class="remove-product-icon" data-delete-id="${matchingProduct.id}" title="Remove ${matchingProduct.name} from cart" aria-label="Remove ${matchingProduct.name} from cart">
              <img src="assets/cart/delete-item-icon.svg">
            </button>
            <img src="assets/cart/image-${matchingProduct.slug}.jpg" class="product-image">
            <div class="cart-product-details">
              <h2>${matchingProduct.cartName}</h2>
              <h3>$ ${matchingProduct.price}</h3>
            </div>
          </div>
          <div class="cart-quantity-button">
            <button class="decrement-button" id="decrement-${matchingProduct.slug}" title="decrease ${matchingProduct.name} quantity">
              -
            </button>
            <p class="cart-item-quantity">${cartItem.quantity}</p>
            <button class="increment-button" id="increment-${matchingProduct.slug}" title="decrease ${matchingProduct.name} quantity">
              +
            </button>
          </div>
      `;
      cartProductsSection.appendChild(cartProduct);
      console.log("Adding cartProductEventListeners for ", matchingProduct.id);
      cartProductEventListeners(cartProduct);
    });
  } else {
    cartProductsSection.innerHTML = "";
    cartProductsSection.textContent = "Your cart is empty!";
    cartProductsSection.style.fontSize = "1.5rem";
    cartProductsSection.style.fontWeight = "Bold";
    cartProductsSection.style.textAlign = "center";
  }

  // cart checkout section
  const cartCheckout = document.getElementById("cart-checkout");
  
  const cartPriceElement = document.getElementById("cart-total-price");
  console.log("Result from cart.totalPrice:", cart.totalPrice);
  cartPriceElement.textContent = cart.totalPrice;
}

export function cartModalEventListeners() {
  console.log("inside cartModalEventListener");

  // close cart button
  const closeCartButton = document.getElementById("close-cart-button");
  closeCartButton.addEventListener("click", () => {
    closeCart();
  });

  // remove all from cart button
  const removeAllButton = document.getElementById("remove-all-button");
  removeAllButton.addEventListener("click", () => {
    removeAllCart();
  });
}

function closeCart() {
  const cartModal = document.getElementById("cart");
  toggleModal(cartModal);
}

function removeAllCart() {
  cart.splice(0, cart.length);
  renderCartModal();
  console.log(cart);
}

function cartProductEventListeners(cartProduct) {
  // id to find for cart
  const productId = Number(cartProduct.dataset.id);

  // remove product from cart
  const removeProductButton = cartProduct.querySelector(".remove-product-icon");

  removeProductButton.addEventListener("click", () => {
    console.log("Deleting product id from cart", productId);
    cart.removeProduct(productId);
    renderCartModal();
  });

  // update quantity button
  const quantityButton = cartProduct.querySelector(".cart-quantity-button");
  const quantityDisplay = quantityButton.querySelector(".cart-item-quantity");
  const quantityDecrementButton = quantityButton.querySelector(".decrement-button");
  const quantityIncrementButton = quantityButton.querySelector(".increment-button");

  quantityDecrementButton.addEventListener("click", () => {
    cart.decrementQuantity(productId);
    const matchingProduct = cart.findById(productId);
    quantityDisplay.textContent = matchingProduct.quantity;

    const cartPriceElement = document.getElementById("cart-total-price");
    cartPriceElement.textContent = cart.totalPrice;
  })

  quantityIncrementButton.addEventListener("click", () => {
    cart.incrementQuantity(productId);
    const matchingProduct = cart.findById(productId);
    quantityDisplay.textContent = matchingProduct.quantity;

    const cartPriceElement = document.getElementById("cart-total-price");
    cartPriceElement.textContent = cart.totalPrice;
  });
}

function decrementCartQuantity(productId, quantityButton) {
  const quantityDisplay = quantityButton.querySelector(".cart-item-quantity");
  const matchingProduct = cart.find(product => product.id === productId);
  if (matchingProduct.quantity > 1) {
    matchingProduct.quantity -= 1;
  } else {
    matchingProduct.quantity = 1;
  }

  quantityDisplay.textContent = matchingProduct.quantity;
  console.log(cart);
}

function incrementCartQuantity(productId, quantityButton) {
  const quantityDisplay = quantityButton.querySelector(".cart-item-quantity");
  const matchingProduct = cart.find(product => product.id === productId);
  matchingProduct.quantity += 1;

  quantityDisplay.textContent = matchingProduct.quantity;
  console.log(cart);
}