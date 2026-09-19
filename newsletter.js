(function () {
  var modal = document.getElementById("subscribe-success");
  if (!modal) return;

  var form = document.querySelector(".newsletter__form");
  var input = form && form.querySelector(".newsletter__input");
  var submitBtn = form && form.querySelector(".newsletter__btn");
  var closeBtns = modal.querySelectorAll("[data-subscribe-close]");
  var previouslyFocused = null;

  function openModal() {
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
    if (!input) return;
    if (!input.value.trim() || !input.checkValidity()) {
      input.reportValidity();
      input.focus();
      return;
    }
    openModal();
    input.value = "";
  }

  if (form && input) {
    form.addEventListener("submit", trySubscribe);
    if (submitBtn) {
      submitBtn.addEventListener("click", trySubscribe);
    }
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
