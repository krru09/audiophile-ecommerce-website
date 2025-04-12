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
    console.log(`${error}`);
    throw error;
  }
}

let jsonPromise = null;
export async function getJsonPromise() {
  if (!jsonPromise) {
    jsonPromise = await loadJSON("data.json");
  }

  return jsonPromise;
}