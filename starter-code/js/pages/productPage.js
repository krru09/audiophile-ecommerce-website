import {productDataPromise} from "../main.js";
import {cart} from "../cart/cart.js";
import {renderCartModal} from "../header.js";
import {CartItem} from "../cart/cartItemClass.js";
import {findProduct, setCurrency, pageSaves, goBackEventListener} from "../utils/utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  await productDataPromise;

  const pagePath = window.location.pathname;

  // split does ["/", "fileName"] and then pop does "fileName"
  const fileName = pagePath.split("/").pop();
  const slug = fileName.replace("product-", "").replace(".html", "");

  const product = findProduct(slug);

  renderProductPage(product);
  buttonEventHandlers(product);

  // used for Go Back links
  pageSaves();
  goBackEventListener();
});

function renderProductPage(product) {
  const productDetailsContainer = document.getElementById("product-details");
  const productDetailsImage = productDetailsContainer.querySelector("picture");
  productDetailsImage.innerHTML = `
    <picture>
      <source media="(min-width: 1440px)" srcset="${product.image.desktop}">
      <source media="(min-width: 768px)" srcset="${product.image.tablet}">
      <img src="${product.image.mobile}" alt="${product.name}" class="product-details-image">
    </picture>
  `;

  const fullProdName = product.name.toUpperCase();
  const prodNameWords = fullProdName.split(" ");
  const prodCategory = prodNameWords.pop();
  const modelName = prodNameWords.join(" ");

  const productDetailsContent = document.getElementById("product-details-content");
  productDetailsContent.innerHTML = `
  <h1 class="product-details-name">${modelName} <br>${prodCategory}</h1>
  <p class="product-details-descriptions">
    ${product.description}
  </p>
  <h2 class="product-details-price">$ ${setCurrency(product.price)}</h2>
  `;

  // product-features-desc
  const productDescriptionContainer = document.getElementById("product-features-desc");
  const productDescription = document.createElement("p");
  const descriptionText = product.features;
  const descriptionParagraphs = descriptionText.split("\n\n");
  productDescription.innerHTML = descriptionParagraphs.join("<br><br>");
  productDescriptionContainer.appendChild(productDescription);

  // in the box list
  const productBox = document.getElementById("product-box");
  const productBoxList = productBox.querySelector("ul");
  const includesObject = product.includes;

  includesObject.forEach(inclusion => {
    const includesListItem = document.createElement("li");
    includesListItem.textContent = inclusion.item;
    const listItemSpan = document.createElement("span");
    listItemSpan.textContent = `${inclusion.quantity}x`;
    includesListItem.prepend(listItemSpan); 
    productBoxList.appendChild(includesListItem);
  });

  // gallery container
  const productGalleryContainer = document.getElementById("gallery-container");
  const galleryImages = product.gallery;
  let galleryId = 1;
  for(let key in galleryImages) {
    const imageContainer = document.createElement("picture");
    imageContainer.id = `gallery${galleryId}`;
    for (let currentKey in galleryImages[key]) {
      if (currentKey === "mobile") {
        const image = document.createElement("img");
        image.src = galleryImages[key][currentKey];
        image.setAttribute("alt", `${product.name} gallery image ${galleryId}`);
        imageContainer.prepend(image);
      } else {
        const sourceImage = document.createElement("source");
        if (currentKey === "tablet") {
          sourceImage.setAttribute("media", "(min-width: 768px)");
          sourceImage.setAttribute("srcset", `${galleryImages[key][currentKey]}`);
        } else {
          sourceImage.setAttribute("media", "(min-width: 1440px)");
          sourceImage.setAttribute("srcset", `${galleryImages[key][currentKey]}`);
        }
        imageContainer.prepend(sourceImage);
      }
    }
    productGalleryContainer.appendChild(imageContainer);
    galleryId += 1;
  }

  // products may like container
  const productsMayLikeList = document.getElementById("products-may-like-list");
  const otherProducts = product.others;

  let productId = 1;
  otherProducts.forEach(product => {
    const otherProductContainer = document.createElement("article");
    otherProductContainer.id = `product-${productId}`;
    
    const otherProductImage = document.createElement("picture");
    const otherProductImages = product.image;
    for (let screenView in otherProductImages) {
      if (screenView === "mobile") {
        const image = document.createElement("img");
        image.src = otherProductImages[screenView];
        image.setAttribute("alt", `${product.name} gallery image ${productId}`);
        otherProductImage.prepend(image);
      } else {
        const sourceImage = document.createElement("source");
        if (screenView === "tablet") {
          sourceImage.setAttribute("media", "(min-width: 768px)");
          sourceImage.setAttribute("srcset", `${otherProductImages[screenView]}`);
        } else {
          sourceImage.setAttribute("media", "(min-width: 1440px)");
          sourceImage.setAttribute("srcset", `${otherProductImages[screenView]}`);
        }
        otherProductImage.prepend(sourceImage);
      }
    }
    const otherProductName = document.createElement("h3");
    otherProductName.textContent = product.name.toUpperCase();

    const otherProductButton = document.createElement("a");
    otherProductButton.setAttribute("href", `product-${product.slug}.html`);
    otherProductButton.className = "orange-button";
    otherProductButton.textContent = "SEE PRODUCT";

    otherProductContainer.appendChild(otherProductImage);
    otherProductContainer.appendChild(otherProductName);
    otherProductContainer.appendChild(otherProductButton);
    
    productsMayLikeList.appendChild(otherProductContainer);
    productId += 1;
  });
}

function buttonEventHandlers(product) {
  // quantity button 
  const quantityButton = document.getElementById("quantity-button");
  changeQuantityFunction(quantityButton);

  // add to cart button
  const addToCartButton = document.getElementById("add-cart-button");
  addCartFunction(addToCartButton, product);
}

function changeQuantityFunction(quantityButton) {
  const currentQuantityEl = quantityButton.querySelector("#product-button-quantity");
  let currentQuantity = Number(currentQuantityEl.textContent);

  // decrement button
  const decrementButton = quantityButton.querySelector("#decrement-button");
  decrementButton.addEventListener("click", () => {
    if ((currentQuantity - 1) < 1) {
      currentQuantity = 1;
    } else {
      currentQuantity -= 1;
    }
    currentQuantityEl.textContent = currentQuantity;
  });

  // increment button
  const incrementButton = quantityButton.querySelector("#increment-button");
  incrementButton.addEventListener("click", () => {
    currentQuantity += 1;
    currentQuantityEl.textContent = currentQuantity;
  });
}

function addCartFunction(addCartButton, product) {
  addCartButton.addEventListener("click", () => {
    const currentQuantityEl = document.querySelector("#product-button-quantity");
    const currentQuantity = Number(currentQuantityEl.textContent);

    const matchingItem = cart.findById(product.id);
    if (matchingItem) {
      console.log("matching item found from productPage.js");
      matchingItem.quantity += currentQuantity;
      cart.localStorageCart = cart.cart;
    } else {
      const newCartItem = new CartItem({
        id: product.id,
        quantity: currentQuantity
      });
      cart.addNewItem(newCartItem);
    }
    renderCartModal();
  });
}