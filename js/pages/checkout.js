import {toggleModal} from "../header.js";
import {productDataPromise} from "../main.js";
import {cart} from "../cart/cart.js";
import {findProduct, setCurrency, pageSaves, goBackEventListener} from "../utils/utils.js";

const checkoutForm = document.getElementById("checkout-form");
const formElements = document.querySelectorAll("input, textarea");
const submitButton = document.getElementById("pay-button");
const checkoutCompleteModal = document.getElementById("checkout-complete-container");

const validation = new JustValidate("#checkout-form", {
  ignoreHiddenFields: true,
});

document.addEventListener("DOMContentLoaded", async () => {
  await productDataPromise;

  renderOrderSummary(cart);
  togglePaymentMethod();

  validation
    .addField("input[id='full-name']", [
      {
        rule: "required",
        errorMessage: "Required field"
      }], {
        errorsContainer: "#name-error"
      })
    .addField("input[id='email-address']", [
      {
        rule: "required",
        errorMessage: "Valid email required"
      }, {
        rule: "email",
        errorMessage: "Valid email required"
      }], {
        errorsContainer: "#email-error"
      })
    .addField("input[id='phone-number']", [
      {
        rule: "required",
        errorMessage: "Phone number required"
      }], {
        errorsContainer: "#phone-error"
      })
    .addField("input[id='address'", [
      {
        rule: "required",
        errorMessage: "Address required"
      },
      {
        rule: "customRegexp",
        value: /^[a-zA-Z0-9\s,'-]*$/,
        errorMessage: "Invalid format"
      }],
      {
        errorsContainer: "#address-error"
      })
    .addField("input[id='zip-code'", [
      {
        rule: "required",
        errorMessage: "Zip Code required"
      },
      {
        rule: "number",
        errorMessage: "Invalid format"
      }],
      {
        errorsContainer: "#zip-error"
      })
    .addField("input[id='city']", [
      {
        rule: "required",
        errorMessage: "City required"
      }], {
        errorsContainer: "#city-error"
      })
    .addField("input[id='country']", [
      {
        rule: "required",
        errorMessage: "Country required"
      },
      {
        rule: "customRegexp",
        value: /^[A-Za-z\s]+$/,
        errorMessage: "Letters only"
      }],
      {
        errorsContainer: "#country-error" 
      })
      .onSuccess((event) => {
      event.preventDefault();
      toggleModal(checkoutCompleteModal);
      // we need to use this setTimeout() so that it happens after the modal is registerd in the dom (initial state of modal is display: none)
      setTimeout(() => {
        scrollToModal(checkoutCompleteModal);
      }, 50);
    });
  
  if (document.querySelector("input[value='e-Money']").checked) {
    const eMoneyValue = document.querySelector("input[type='radio']:checked").value;
    displayPaymentInfo(eMoneyValue);
    eMoneyValidations();
  }

  submitButton.addEventListener("click", () => {
    checkoutForm.requestSubmit();
  });

  pageSaves();
  goBackEventListener();
});

function eMoneyValidations() {
  validation
    .addField("input[id='e-money-num']", [
      {
        rule: "required",
        errorMessage: "e-Money number required"
      },
      {
        rule: "number",
        errorMessage: "Numbers only"
      }], 
      {
        errorsContainer: "#e-money-num-error"
      })
    .addField("input[id='e-money-pin']", [
      {
        rule: "required",
        errorMessage: "Pin required"
      },
      {
        rule: "number",
        errorMessage: "Numbers only"
      }],
      {
        errorsContainer: "#e-money-pin-error"
      })
}

function scrollToModal(modal) {
  // modal.getBoundingClientRect().top = the distance from the top of the viewport to the top of the modal
  // modal.getBoundingClientRect().top is relative to the current scroll position, so we add window.scrollY to get the actual distance from the top of the entire document.
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
      if (radioButton.value === "e-Money") {
        eMoneyValidations();
      } else if (radioButton.value === "Cash on Delivery") {
        console.log(validation);
        validation.removeField("input[id='e-money-num']");
        validation.removeField("input[id='e-money-pin']");
        validation.revalidate();
      }
    });
  });
} 

function displayPaymentInfo(paymentType) {
  const eMoneyInfoContainer = document.getElementById("e-money-input-container");
  const cashDeliveryInfoContainer = document.getElementById("cash-delivery-container");
  console.log(paymentType);

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

function renderOrderSummary(cart) {
  const cartProductsContainer = document.getElementById("checkout-products");
  cart.cart.forEach(cartItem => {
    console.log(cartItem.id);
    const matchingProduct = findProduct(cartItem.id)
    console.log(matchingProduct);

    const productContainer = document.createElement("article");
    const productImage = document.createElement("img");
    productImage.src = `assets/cart/image-${matchingProduct.slug}.jpg`;
    productContainer.appendChild(productImage);

    const productDetailsContainer = document.createElement("div");
    productDetailsContainer.className = "cart-product-details";
    const productTitle = document.createElement("h3");
    productTitle.textContent = `${matchingProduct.cartName}`;
    const productPrice = document.createElement("h4");
    productPrice.textContent = `$ ${setCurrency(matchingProduct.price)}`;
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
  subtotalAmountEl.textContent = `$ ${setCurrency(cart.totalPrice)}`;

  // cart calculations -- shipping
  // shipping is always $50
  const shippingPrice = 50;
  const shippingContainer = document.getElementById("cart-shipping");
  const shippingEl = shippingContainer.querySelector("h4");
  shippingEl.textContent = `$ ${setCurrency(shippingPrice)}`;

  // cart calculations -- vat
  // vat is always 20% of product total, excluding shipping
  let vat = Math.round(cart.totalPrice * 0.20);
  const vatContainer = document.getElementById("cart-vat");
  const vatEl = vatContainer.querySelector("h4");
  vatEl.textContent = `$ ${setCurrency(vat)}`;
  // console.log(vat);

  // grand total
  const grandTotalContainer = document.getElementById("cart-grand-total");
  const grandTotalEl = grandTotalContainer.querySelector("h4");
  grandTotalEl.textContent = `$ ${setCurrency(cart.totalPrice + shippingPrice)}`;
}