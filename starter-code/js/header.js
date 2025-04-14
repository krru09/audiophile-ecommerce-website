export const cart = [
  {
    id: 4,
    name: "XX99 Mark Two Headphones",
    slug: "XX99-mark-two-headphones",
    cartName: "XX99 MK II",
    price: 2999,
    quantity: 1
  },
  {
    id: 2,
    name: "XX59 Heaphones",
    slug: "xx59-headphones",
    cartName: "XX59",
    price: 899,
    quantity: 2
  },
  {
    id: 1,
    name: "YX1 Wireless Earphones",
    slug: "yx1-earphones",
    cartName: "YX1",
    price: 599,
    quantity: 1
  }
];

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
  if (modalContainer.classList.contains("hidden")) {
    modalContainer.classList.remove("hidden");
  } else {
    modalContainer.classList.add("hidden");
  }
}

export function renderCartModal() {
  const cartButtonContainer = document.getElementById("cart-button-container");
  let cartTotalQuantity = 0;
  cart.forEach(cartItem => {
    cartTotalQuantity += cartItem.quantity;
  });

  const cartDialog = document.getElementById("cart");
  const cartQuantity = document.getElementById("cart-quantity");
  cartQuantity.textContent = cartTotalQuantity;

  const cartProductsSection = document.getElementById("cart-products");
  if (cart.length > 1) {
    cart.forEach(cartItem => {
      const cartProduct = document.createElement("article");
      cartProduct.className = "cart-product";
      cartProduct.innerHTML = `
          <div class="product-details-container" data-id="${cartItem.id}" data-slug="${cartItem.slug}">
            <img src="assets/cart/image-${cartItem.slug}.jpg" class="product-image">
            <div class="cart-product-details">
              <h2>${cartItem.cartName}</h2>
              <h3>$ ${cartItem.price}</h3>
            </div>
          </div>
          <div class="cart-quantity-button" data-id="${cartItem.id}">
            <button class="decrement-button" id="decrement-${cartItem.slug}" title="decrease ${cartItem.name} quantity">
              -
            </button>
            <p>${cartItem.quantity}</p>
            <button class="increment-button" id="increment-${cartItem.slug}" title="decrease ${cartItem.name} quantity">
              +
            </button>
          </div>
      `;
      cartProductsSection.appendChild(cartProduct);
    });
  } else {
    cartProductsSection.innerHTML = "";
  }

  // cart checkout section
  const cartCheckout = document.getElementById("cart-checkout");

  // cart total
  let cartTotalPrice = 0;
  cart.forEach(cartItem => {
    if (cartItem.quantity > 1) {
      cartTotalPrice += (cartItem.price * cartItem.quantity);
    } else {
      cartTotalPrice += cartItem.price;
    }
  });
  
  const cartPriceElement = document.getElementById("cart-total-price");
  cartPriceElement.textContent = cartTotalPrice;
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
  console.log("inside closeCart function");
  const cartModal = document.getElementById("cart");
  toggleModal(cartModal);
}

function removeAllCart() {
  cart.splice(0, cart.length);
  renderCartModal();
  console.log(cart);
}