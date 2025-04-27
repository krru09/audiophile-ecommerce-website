import {renderCartModal, cartModalEventListeners, headerEventListeners} from "./header.js";
import {getJsonPromise} from "./loadJSON.js";
import {returnCurrentYear} from "./utils/utils.js"

export const productData = [];
// Immediately Invoked Function Expression (IFFE) - asynchronous function expression that is immediately invoked with (), which means it's called right away and its return value (a promise) gets stored in productDataPromise
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

  // render footer year
  const footerYear = document.getElementById("footer-copyright");
  footerYear.textContent = `Copyright ${returnCurrentYear()}. All Rights Reserved`;
});