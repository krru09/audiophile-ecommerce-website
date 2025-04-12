import {renderCartModal, cartModalEventListeners, headerEventListeners} from "./header.js";
import {getJsonPromise} from "./loadJSON.js";

export const productData = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await getJsonPromise();
    data.forEach(product => {
      productData.push(product);
    });
    console.log(productData);
  } catch (error) {
    console.error("There was an error: ", error);
  }

  // header event listeners
  headerEventListeners();

  // cart modal js
  renderCartModal();
  cartModalEventListeners();
});