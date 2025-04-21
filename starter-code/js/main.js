import {renderCartModal, cartModalEventListeners, headerEventListeners} from "./header.js";
import {getJsonPromise} from "./loadJSON.js";

export const productData = [];
export const productDataPromise = (async () => {
  // makes sure we only call fetch once by using getJsonPromise();
  const data = await getJsonPromise();
  data.forEach(product => {
    productData.push(product);
  });

  return productData;
})();

document.addEventListener("DOMContentLoaded", async () => {
  await productDataPromise;

  // header event listeners
  headerEventListeners();

  // cart modal js
  renderCartModal();
  cartModalEventListeners();
});