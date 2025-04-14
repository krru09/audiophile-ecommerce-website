import {cart, toggleModal} from "../header.js";
import {productData} from "../main.js";
import {getJsonPromise} from "../loadJSON.js";

const checkoutForm = document.getElementById("checkout-form");
const formElements = document.querySelectorAll("input, textarea");
const submitButton = document.getElementById("pay-button");
console.log(submitButton);
const checkoutCompleteModal = document.getElementById("checkout-complete-container");

document.addEventListener("DOMContentLoaded", async () => {
  await getJsonPromise();

  renderOrderSummary(cart);
  togglePaymentMethod();
  formValidation();

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    toggleModal(checkoutCompleteModal);
    // we need this set timeout so that the modal actually appears in the dom (the modal is initially hidden with display: none until the user hits submit)
    setTimeout(() => {
      scrollToModal(checkoutCompleteModal);
    }, 50);
  });
  
  submitButton.addEventListener("click", () => {
    checkoutForm.requestSubmit();
  });
});

function scrollToModal(modal) {
  // modal.getBoundingClientRect().top = the distance from the top of the viewport to the top of the modal
  // but is relative to the current scroll position, so we add window.scrollY to get the actual distance from the top of the entire document.
  // this gives the absolute position of the top of the modal in the page
  const modalTop = modal.getBoundingClientRect().top + window.scrollY;

  // this gives height of modal in px
  const modalHeight = modal.offsetHeight;
  // this gives height of browsers visible window - the part of hte page the user can currently see
  const viewportHeight = window.innerHeight;

  // modalTop is where the top of the modal currently is; we want the modal's center to line up with the center of the viewport (which is viewportHeight / 2);
  // subtract half the veiwport in height -- you're scrolling up to bring the center of the screen to the modal
  // add half the modal height -- you're nudging it so that the modal's center aligns with the viewport's center
  const scrollY = modalTop - (viewportHeight / 2) + (modalHeight / 2);

  window.scrollTo({
    top: scrollY,
    left: 0,
    behavior: "smooth"
  });
}

function togglePaymentMethod() {
  const paymentRadioContainer = document.getElementById("payment-container");
  const paymentRadioButtons = paymentRadioContainer.querySelectorAll("input[type='radio']");

  paymentRadioButtons.forEach(radioButton => {
    radioButton.addEventListener("change", () => {
      displayPaymentInfo(radioButton.value);
    });
  });
} 

function displayPaymentInfo(paymentType) {
  const eMoneyInfoContainer = document.getElementById("e-money-input-container");
  const cashDeliveryInfoContainer = document.getElementById("cash-delivery-container");

  switch (paymentType) {
    case "e-Money":
      eMoneyInfoContainer.classList.remove("hidden");
      cashDeliveryInfoContainer.classList.add("hidden");
      break;
    case "Cash on Delivery":
      eMoneyInfoContainer.classList.add("hidden");
      cashDeliveryInfoContainer.classList.remove("hidden");
  }
}

function textErrors(textElement) {
  textElement.classList.add("error-border");
}

function formValidation() {
  // billing details form validations
  const billingDetailsFieldset = document.getElementById("billing-details");
  billingDetailsValidation(billingDetailsFieldset);
}

function billingDetailsValidation(fieldset) {
  // this is if any information for billing details is empty
  const billingInput = fieldset.querySelectorAll("input[type='text']");
  //console.log(billingInput);
  billingInput.forEach(input => {
    input.addEventListener("invalid", (event) => {
      event.preventDefault();
      textErrors(input);
      console.log(input);
    });
  });
}

function renderOrderSummary(cart) {
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