import {cart, toggleModal} from "../header.js";
import {productData} from "../main.js";
import {getJsonPromise} from "../loadJSON.js";

document.addEventListener("DOMContentLoaded", async () => {
  await getJsonPromise();

  renderOrderSummary(cart);
  
  const payButton = document.getElementById("pay-button");
  const checkoutModal = document.getElementById("checkout-complete-container");
  console.log(payButton);
  payButton.addEventListener("click", () => {
    console.log("checkout button clicked!");
    toggleModal(checkoutModal)
  });
});

export function renderOrderSummary(cart) {
  console.log(cart);
  const cartProductsContainer = document.getElementById("checkout-products");
  cart.forEach(cartItem => {
    const productContainer = document.createElement("article");
    const productImage = document.createElement("img");
    productImage.src = `assets/cart/image-${cartItem.slug}.jpg`;
    productContainer.appendChild(productImage);

    const productDetailsContainer = document.createElement("div");
    productDetailsContainer.className = "cart-product-details";
    const productTitle = document.createElement("h3");
    productTitle.textContent = `${cartItem.cartName}`;
    const productPrice = document.createElement("h4");
    productPrice.textContent = `$ ${cartItem.price}`;
    productDetailsContainer.appendChild(productTitle);
    productDetailsContainer.appendChild(productPrice);
    productContainer.appendChild(productDetailsContainer);

    const productQuantity = document.createElement("p");
    productQuantity.textContent = `x${cartItem.quantity}`;
    productContainer.appendChild(productQuantity);

    cartProductsContainer.appendChild(productContainer);
  });

  // cart calculations section
  const cartSubtotal = document.getElementById("cart-subtotal");
  const subtotalAmountEl = cartSubtotal.querySelector("h4");
  let cartTotal = 0;
  cart.forEach(cartItem => {
    cartItem.quantity > 1 ? cartTotal += cartItem.quantity*cartItem.price : cartTotal += cartItem.price;
  });
  subtotalAmountEl.textContent = `$ ${cartTotal}`;

  // cart calculations -- shipping
  // shipping is always $50
  const shippingPrice = 50;
  const shippingContainer = document.getElementById("cart-shipping");
  const shippingEl = shippingContainer.querySelector("h4");
  shippingEl.textContent = `$ ${shippingPrice}`;

  // cart calculations -- vat
  // vat is always 20% of product total, excluding shipping
  let vat = Math.round(cartTotal * 0.20);
  const vatContainer = document.getElementById("cart-vat");
  const vatEl = vatContainer.querySelector("h4");
  vatEl.textContent = `$ ${vat}`;
  // console.log(vat);

  // grand total
  const grandTotalContainer = document.getElementById("cart-grand-total");
  const grandTotalEl = grandTotalContainer.querySelector("h4");
  grandTotalEl.textContent = `$ ${cartTotal + shippingPrice}`;
}