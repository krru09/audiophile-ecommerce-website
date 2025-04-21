import {productDataPromise} from "../main.js";
import {filterProducts, pageSaves} from "../utils/utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  await productDataPromise;

  const pageCategory = document.querySelector("#category-main").dataset.category;
  
  const categoryProducts = filterProducts(pageCategory);

  renderCategoryPage(categoryProducts);
});

function renderCategoryPage(categoryProducts) {
  // this sorts the array so that the newest product are first
  const productsNewSorted = categoryProducts.sort((product1, product2) => {
    const product1New = product1.new;
    const product2New = product2.new;

    if (product1New && !product2New) {
      return -1;
    } else if (!product1New && product2New) {
      return 1;
    } else {
      return 0;
    }
  });

  // dynamically add html for product listings
  const productsContainer = document.getElementById("category-products");
  let containerCounter = 1;
  productsNewSorted.forEach(product => {
    const productContainer = document.createElement("section");
    productContainer.className = "category-product";
    
    if (containerCounter % 2 === 0) {
      console.log("containerCounter is even");
      productContainer.classList.add("reverse");
    }

    productContainer.innerHTML = `
      <picture>
        <source media="(min-width:1024px)" srcset="${product.categoryImage.desktop}">
        <source media="(min-width: 768px)" srcset="${product.categoryImage.tablet}">
        <img src="${product.categoryImage.mobile}" class="category-product-image" alt="${product.name}">
      </picture>
    `;

    const categoryContentContainer = document.createElement("article");
    categoryContentContainer.className = "category-content-container";
    if (product.new) {
      console.log("product is new");
      const newItemText = document.createElement("p");
      newItemText.id = "category-new-product";
      newItemText.className = "orange-text";
      newItemText.textContent = "NEW PRODUCT";
      
      categoryContentContainer.appendChild(newItemText);
    }

    const fullProdName = product.name.toUpperCase();
    const prodNameWords = fullProdName.split(" ");
    const prodCategory = prodNameWords.pop();
    const modelName = prodNameWords.join(" ");
    
    categoryContentContainer.innerHTML += `
      <h2 class="category-product-name">
        ${modelName}<br>${prodCategory}
      </h2>
      <h3 class="category-description">
        ${product.description}
      </h3>
      <a href="product-${product.slug}.html" class="orange-button">SEE PRODUCT</a>
    `;

    productContainer.append(categoryContentContainer);
    productsContainer.appendChild(productContainer);

    containerCounter += 1;
  });
}