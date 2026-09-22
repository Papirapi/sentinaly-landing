(function () {
  var modal = document.getElementById("subscribe-success");
  if (!modal) return;

  var form = document.querySelector(".newsletter__form");
  var input = form && form.querySelector(".newsletter__input");
  var submitBtn = form && form.querySelector(".newsletter__btn");
  var closeBtns = modal.querySelectorAll("[data-subscribe-close]");
  var previouslyFocused = null;

  var SUBSCRIBE_URL = "https://djzpiha4se.execute-api.eu-central-1.amazonaws.com/prod/contact_sentinaly";
  var SUBSCRIBE_API_KEY = "gab5JAzrEd18XjYgtqfxD9OKIb5xpAiA3fnxIqzA";
  var titleEl = modal.querySelector(".subscribe-success__title");
  var textEl = modal.querySelector(".subscribe-success__text");
  var MESSAGES = {
    subscribed: { title: titleEl.textContent, text: textEl.textContent },
    duplicate: {
      title: "You're already on the list.",
      text: "This email is already subscribed to the Sentinaly newsletter.",
    },
  };

  /* The HTTP status is always 200; the real outcome is the envelope's
     statusCode. A non-2xx HTTP status (403) means the API key was rejected.
     Resolves to the statusCode, or 0 on a network failure. */
  function subscribe(email) {
    return fetch(SUBSCRIBE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": SUBSCRIBE_API_KEY },
      body: JSON.stringify({ email: email }),
    })
      .then(function (res) {
        return res.ok ? res.json() : { statusCode: res.status };
      })
      .then(function (envelope) {
        return envelope.statusCode;
      })
      .catch(function () {
        return 0;
      });
  }

  function showError(message) {
    input.setCustomValidity(message);
    input.reportValidity();
    input.focus();
  }

  function openModal(kind) {
    var copy = MESSAGES[kind] || MESSAGES.subscribed;
    titleEl.textContent = copy.title;
    textEl.textContent = copy.text;
    previouslyFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("is-modal-open");
    var doneBtn = modal.querySelector(".subscribe-success__done");
    if (doneBtn) doneBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("is-modal-open");
    if (previouslyFocused && typeof previouslyFocused.focus === "function") {
      previouslyFocused.focus();
    }
  }

  function trySubscribe(event) {
    if (event) event.preventDefault();
    if (!input || (submitBtn && submitBtn.disabled)) return;
    input.setCustomValidity("");
    if (!input.value.trim() || !input.checkValidity()) {
      input.reportValidity();
      input.focus();
      return;
    }

    var label = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    subscribe(input.value.trim()).then(function (status) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = label;
      }
      /* 502 = contact saved but the welcome email failed; still a success for the visitor. */
      if (status === 200 || status === 502) {
        input.value = "";
        openModal("subscribed");
      } else if (status === 409) {
        input.value = "";
        openModal("duplicate");
      } else if (status === 400) {
        showError("Please enter a valid email address.");
      } else {
        showError("Something went wrong. Please try again.");
      }
    });
  }

  if (form && input) {
    form.addEventListener("submit", trySubscribe);
    if (submitBtn) {
      submitBtn.addEventListener("click", trySubscribe);
    }
    input.addEventListener("input", function () {
      input.setCustomValidity("");
    });
  }

  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });

  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
})();
