const element = document.getElementById("content");
const params = new URLSearchParams(window.location.search);
const sessionId = params.get("id");

await loadAndRenderSuggestions(sessionId, element);

async function loadAndRenderSuggestions(sessionId, element) {
  const response = await fetch(`/api/suggestions/${sessionId}`);
  if (response.ok) {
    const suggestions = await response.json();
    console.log(suggestions);
  } else {
    element.textContent = "Could not get suggestions, try again later";
  }
}
