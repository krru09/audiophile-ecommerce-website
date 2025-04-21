import {productData} from "../main.js";

// return currency in string format
export function setCurrency(itemPrice) {
  return itemPrice.toLocaleString();
};

// find data from productData
export function findProduct(info) {
  if (typeof info === "string") {
    return productData.find(product => product.slug === info);
  } else {
    return productData.find(product => product.id === info);
  }
}

// filter products to only return products of the same category
export function filterProducts(categoryName) {
  return productData.filter(product => product.category === categoryName);
}