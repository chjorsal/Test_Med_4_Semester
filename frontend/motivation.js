const element = document.getElementById("content");
const elements = document.querySelectorAll(".song-title");

const params = new URLSearchParams(window.location.search);
const sessionId = params.get("id");

let suggestions = [];

init();

async function init() {
  await loadAndRenderSuggestions(sessionId, element);
  await forEachRender();
}

async function forEachRender() {
  elements.forEach((currentElement, index) => {
    if (suggestions[index]) {
      currentElement.textContent = suggestions[index].songname;
    }
  });
}

async function loadAndRenderSuggestions(sessionId, element) {
  try {
    const response = await fetch(`/api/suggestions/${sessionId}`);

    if (!response.ok) {
      element.textContent = "Could not get suggestions, try again later";
      return;
    }

    suggestions = await response.json();
    console.log(suggestions);

    /*const container = document.createElement("div");
    renderTrack(suggestions, container);
    element.appendChild(container); */
  } catch (error) {
    console.error(error);
    element.textContent = "Something went wrong";
  }
}

function renderTrack(suggestions, element) {
  if (!suggestions.length) return;
  const track = document.createElement("h1");
  track.textContent = suggestions[0].songname;
  element.appendChild(track);
}
