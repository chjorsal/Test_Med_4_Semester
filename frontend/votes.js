async function loadVotes() {
  const response = await fetch("/api/votes");
  const votes = await response.json();

  votes.forEach(function (song) {
    const btn = document.querySelector(
      'button[data-track-id="' + song.track_id + '"]', // id er de forskellige knapper
    );

    if (btn) {
      const countEl = btn.nextElementSibling;
      countEl.textContent = song.votes;
    }
  });
}

async function vote(btn) {
  if (btn.disabled) {
    //
    return;
  }

  const track_Id = btn.dataset.trackId;

  const response = await fetch("/api/votes", {
    // poster et count på vores server.js og i vores SQL
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ track_id: track_Id, user_id: 1, session_id: 1 }), // de skal laves om senere så de ikke er fixed
    // de skal astates af currentSessionId eller ligende
  });

  if (!response.ok) {
    // hvis dette reponse ikke er ok så slå den knappen fra stem og i stedet
    console.error("Server error:", response.status, await response.text());
    btn.disabled = true;
    btn.textContent = "Har stemt";
    return;
  }

  const countEl = btn.nextElementSibling;
  countEl.textContent = parseInt(countEl.textContent) + 1;
  btn.disabled = true;
  btn.textContent = "Har stemt";
}

loadVotes();

// denne funktion kører i et specifikt tidsinterval og nulstiller stemmerne og gør det muligt at stemme
// igen på en sang.
setInterval(async function () {
  await fetch("/api/votes", {
    method: "DELETE",
  });
  await loadVotes();

  document.querySelectorAll("button[data-track-id]").forEach(function (btn) {
    btn.disabled = false;
    btn.textContent = "Stem";
  });
}, 10000);
