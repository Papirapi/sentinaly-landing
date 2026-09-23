(function () {
  var ENDPOINT = "https://djzpiha4se.execute-api.eu-central-1.amazonaws.com/prod/unsubscribe_sentinaly";

  var card = document.getElementById("unsub-card");
  var titleEl = document.getElementById("unsub-title");
  var textEl = document.getElementById("unsub-text");
  var actionBtn = document.getElementById("unsub-action");
  if (!card || !titleEl || !textEl || !actionBtn) return;

  var STATES = {
    loading: { title: "One moment", text: "Checking your link…" },
    confirm: {
      title: "Unsubscribe?",
      text: "Confirm that you no longer want to receive emails from Sentinaly.",
      button: "Confirm unsubscribe",
    },
    done: {
      title: "You're unsubscribed",
      text: "You won't receive future subscription emails from Sentinaly.",
    },
    invalid: {
      title: "Link unavailable",
      text: "This unsubscribe link is invalid. Please use the link from your most recent email.",
    },
    error: {
      title: "Please try again",
      text: "We couldn't process your request right now.",
      button: "Try again",
    },
  };

  var token = "";
  var busy = false;
  var retry = null; /* what "Try again" re-runs: validate or confirm */

  function setState(name) {
    var copy = STATES[name];
    card.setAttribute("data-state", name);
    titleEl.textContent = copy.title;
    textEl.textContent = copy.text;
    actionBtn.hidden = !copy.button;
    actionBtn.disabled = false;
    if (copy.button) actionBtn.textContent = copy.button;
  }

  function url() {
    return ENDPOINT + "?token=" + encodeURIComponent(token);
  }

  function readJson(res) {
    if (!res.ok) throw new Error("http");
    return res.json();
  }

  function startRequest() {
    busy = true;
    actionBtn.disabled = true;
    actionBtn.textContent = "Working…";
  }

  function validate() {
    if (busy) return;
    retry = validate;
    busy = true;
    setState("loading");
    return fetch(url(), { method: "GET", headers: { Accept: "application/json" } })
      .then(readJson)
      .then(function (data) {
        setState(data && data.valid === true ? "confirm" : "invalid");
      })
      .catch(function () {
        setState("error");
      })
      .then(function () {
        busy = false;
      });
  }

  function confirm() {
    if (busy) return;
    retry = confirm;
    startRequest();
    return fetch(url(), {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
      body: "List-Unsubscribe=One-Click",
    })
      .then(readJson)
      .then(function (data) {
        var status = data && data.status;
        if (status === "unsubscribed") setState("done");
        else if (status === "invalid") setState("invalid");
        else setState("error");
      })
      .catch(function () {
        setState("error");
      })
      .then(function () {
        busy = false;
      });
  }

  actionBtn.addEventListener("click", function () {
    if (busy) return;
    var state = card.getAttribute("data-state");
    if (state === "confirm") confirm();
    else if (state === "error" && retry) retry();
  });

  try {
    token = new URLSearchParams(window.location.search).get("token") || "";
  } catch (err) {
    token = "";
  }
  token = token.trim();

  if (!token) {
    setState("invalid");
    return;
  }

  validate();
})();
