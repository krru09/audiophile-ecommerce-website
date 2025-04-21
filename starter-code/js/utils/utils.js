import {productData} from "../main.js";

// return currency in string format
export function setCurrency(itemPrice) {
  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });

  return USDollar.format(itemPrice);
};

// find data from productData
export function findProduct(info) {
  return productData.find(product => product.info === info);
}

// filter products to only return products of the same category
export function filterProducts(categoryName) {
  return productData.filter(product => product.category === categoryName);
}