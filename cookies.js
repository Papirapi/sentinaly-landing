(function () {
  var STORAGE_KEY = "sentinaly_cookie_consent";

  var banner = document.getElementById("cookie-banner");
  if (!banner) return;

  if (localStorage.getItem(STORAGE_KEY)) {
    banner.hidden = true;
    return;
  }

  var closeBtn = banner.querySelector(".cookie-banner__close");
  var declineBtn = banner.querySelector(".cookie-banner__btn--decline");
  var acceptBtn = banner.querySelector(".cookie-banner__btn--accept");

  function dismiss(choice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch (err) {
      /* ignore storage failures */
    }

    banner.classList.remove("is-visible");
    window.setTimeout(function () {
      banner.hidden = true;
    }, 350);
  }

  function show() {
    banner.hidden = false;
    window.requestAnimationFrame(function () {
      banner.classList.add("is-visible");
    });
  }

  closeBtn.addEventListener("click", function () {
    dismiss("dismissed");
  });

  declineBtn.addEventListener("click", function () {
    dismiss("declined");
  });

  acceptBtn.addEventListener("click", function () {
    dismiss("accepted");
  });

  show();
})();
