function useEndpoint(method, url, requestBody) {
  const hasBody = requestBody !== undefined;
  const body = hasBody ? JSON.stringify(requestBody) : undefined;
  const button = document.createElement("button");
  button.innerText = hasBody ? `${method} ${url} ${body}` : `${method} ${url}`;

  const loader = document.createElement("p");
  loader.setAttribute("class", "loader");

  const section = document.createElement("section");
  section.appendChild(button);
  section.appendChild(loader);
  document.querySelector("body").appendChild(section);

  let responseContainer = null;

  button.addEventListener("click", () => {
    button.disabled = true;
    loader.innerText = "Awaiting response...";
    if (responseContainer !== null) {
      section.removeChild(responseContainer);
      responseContainer = null;
    }
    const updateTime = Date.now() + 400; // artificial delay for better UX
    const updateLater = (command) => {
      setTimeout(command, Math.max(0, updateTime - Date.now()));
    };
    const options = hasBody
      ? {
          method,
          body,
          headers: {
            "Content-Type": "application/json",
          },
        }
      : { method };
    fetch(url, options)
      .then((response) => {
        updateLater(
          () =>
            (loader.innerText = `${response.status} ${response.statusText}`),
        );
        if (!response.ok) {
          throw new Error(
            `Endpoint ${method} ${url} failed with status ${response.status} ${response.statusText}`,
          );
        }
        return response.status === 202 ? "" : response.text();
      })
      .then((text) => {
        if (text.length === 0) {
          return;
        }
        responseContainer = document.createElement("div");
        try {
          const tree = jsonview.create(text);
          jsonview.render(tree, responseContainer);
          jsonview.expand(tree);
        } catch (e) {
          const errorMessage = document.createElement("p");
          errorMessage.setAttribute("class", "invalid-json");
          errorMessage.innerText = e.message;
          responseContainer.appendChild(errorMessage);
        }
        updateLater(() => section.appendChild(responseContainer));
      })
      .catch((e) => {
        console.warn(e.message);
      })
      .finally(() => {
        updateLater(() => (button.disabled = false));
      });
  });

  async function loadVotes() {
    const response = await fetch("/api/votes");
    const votes = await response.json();

    console.log(votes);

    votes.forEach(function (song) {
      const btn = document.querySelector(
        'button[data-song-id="' + song.track_id + '")',
      );

      if (btn) {
        const countE1 = btn.nextElementSibling;
        countE1.textContent = song.count;
      }
    });
  }

  async function vote(btn) {
    if (btn.disabled) {
      return;
    }
    const songId = btn.dataset.songId;

    const response = await fetch("/api/vote/" + songId, {
      method: "POST",
    });
    if (response.ok) {
      const countEl = btn.nextElementSibling;
      countEl.textContent = parseInt(countEl.textContent) + 1;
      btn.disabled = true;
      btn.textContent = "Gestemd";
    }
  }
}
