const element = document.getElementById("content");

const params = new URLSearchParams(window.location.search);
const sessionId = params.get("id");

await loadAndRenderSuggestions(sessionId, element);

async function loadAndRenderSuggestions(sessionId, element) {
  const response = await fetch(`/api/suggestions/${sessionId}`);
  if (response.ok) {
    const suggestions = await response.json();
    console.log(suggestions);
    const tracksElement = document.createElement("div");
    renderTrack(suggestions, tracksElement);
    element.appendChild(tracksElement);
  } else {
    element.textContent = "Could not get suggestions, try again later";
  }
}

function renderTrack(suggestions, element) {
  const tracksElement = document.createElement("h1");
  tracksElement.textContent = ` ${suggestions[0].songname}`;
  element.appendChild(tracksElement);
}
