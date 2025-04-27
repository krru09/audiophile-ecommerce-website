// load data from JSON so we can load it onto the page
const jsonFile = "data.json";

async function loadJSON() {
  try {
    const response = await fetch(jsonFile);
    if (!response.ok) {
      throw new Error();
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw error;
  }
}

// this function makes sure that loadJSON() is only called once, and that each page can just reference this function which returns the jsonPromise
let jsonPromise = null;
export async function getJsonPromise() {
  if (!jsonPromise) {
    jsonPromise = await loadJSON("data.json");
  }

  return jsonPromise;
}