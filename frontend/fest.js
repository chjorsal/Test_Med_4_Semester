const element = [];
const elements = document.querySelectorAll(".song-title");
const Artistelements = document.querySelectorAll(".song-artist");
const playing = document.querySelector(".now-playing-mid");
const playingArtist = document.querySelector(".now-playing-bottom");

const params = new URLSearchParams(window.location.search);
const sessionId = params.get("id");

let suggestions = [];

await loadAndRenderSuggestions(sessionId, element);
await forEachRenderTracks();
await forEachRenderArtist();

setInterval(async () => {
  await loadAndRenderSuggestions(sessionId, element);
  await forEachRenderTracks();
  await forEachRenderArtist();
}, 10000);
setInterval(async () => {
  await NextSongTitle();
}, 9999);

async function loadAndRenderSuggestions(sessionId, element) {
  try {
    const response = await fetch(`/api/suggestions/${sessionId}`);

    if (!response.ok) {
      element.textContent = "Could not get suggestions, try again later";
      return;
    }

    suggestions = await response.json();
    console.log(suggestions);
  } catch (error) {
    console.error(error);
    element.textContent = "Something went wrong";
  }
}

async function forEachRenderTracks() {
  elements.forEach((currentElement, index) => {
    if (suggestions[index]) {
      currentElement.textContent = suggestions[index].songname;
    }
  });
}

async function forEachRenderArtist() {
  Artistelements.forEach((currentElement, index) => {
    if (suggestions[index]) {
      currentElement.textContent = suggestions[index].artist;
    }
  });
}

async function NextSongTitle() {
  playing.textContent = suggestions[0].songname;
  playingArtist.textContent = suggestions[0].artist;
}
