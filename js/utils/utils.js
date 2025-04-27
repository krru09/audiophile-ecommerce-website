import {productData} from "../main.js";

export function goBackEventListener() {
  const backButton = document.getElementById("go-back-link");
  backButton.addEventListener("click", (e) => {
    e.preventDefault();
    const lastPage = pullLastPage();
    console.log("redirecting to: ", lastPage);
    window.location.href = lastPage;
  });
}

export function pageSaves() {
  const links = document.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      if (link.id === "go-back-link") {
        return;
      }
      saveGoBackPage();
    });
  });
}

export function saveGoBackPage() {
  const previousPage = window.location.pathname;
  const pages = JSON.parse(localStorage.getItem("lastPages")) || [];
  console.log(pages);
  if (pages[0] !== previousPage) {
    pages.unshift(previousPage);
  }

  localStorage.setItem("lastPages", JSON.stringify(pages));
}

export function pullLastPage() {
  const pages = JSON.parse(localStorage.getItem("lastPages"));
  const lastPage = pages.shift() || "/index.html";
  console.log(pages);
  localStorage.setItem("lastPages", JSON.stringify(pages));
  return lastPage;
}

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

export function returnCurrentYear() {
  const todaysDate = new Date();
  return todaysDate.getFullYear();
}