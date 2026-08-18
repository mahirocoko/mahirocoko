(() => {
  const stage = document.getElementById("stage");
  const slides = [...document.querySelectorAll(".slide")];
  const TOTAL = slides.length;
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const progressCurrent = document.getElementById("progress-current");
  const progressTotal = document.getElementById("progress-total");
  const notesDialog = document.getElementById("notes-dialog");
  const notesKicker = document.getElementById("notes-kicker");
  const notesBody = document.getElementById("notes-body");

  let index = 1;
  let touchStartX = 0;
  let touchStartY = 0;

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const narrow = () => window.matchMedia("(max-width: 900px)").matches;

  function parseHash() {
    const n = Number.parseInt(location.hash.replace("#", ""), 10);
    if (Number.isInteger(n) && n >= 1 && n <= TOTAL) return n;
    return 1;
  }

  function scaleStage() {
    if (narrow()) {
      stage.style.transform = "none";
      return;
    }
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = `scale(${scale})`;
  }

  function notesFor(slide) {
    const tpl = slide.querySelector("template.notes");
    return tpl ? tpl.innerHTML.trim() : "";
  }

  function syncNotes() {
    const slide = slides[index - 1];
    notesKicker.textContent = `สไลด์ ${index}`;
    notesBody.textContent = notesFor(slide);
  }

  function applySlide(nextIndex, { hash = true } = {}) {
    index = nextIndex;
    slides.forEach((slide, i) => {
      const active = i === index - 1;
      slide.classList.toggle("is-active", active);
      slide.hidden = !active;
    });
    progressCurrent.textContent = String(index);
    prevBtn.disabled = index <= 1;
    nextBtn.disabled = index >= TOTAL;
    document.title = `${index}/${TOTAL} · ใช้ AI ทำงานยังไง`;
    syncNotes();
    if (hash && location.hash !== `#${index}`) {
      history.replaceState(null, "", `#${index}`);
    }
  }

  function focusSlide() {
    const slide = slides[index - 1];
    const heading = slide.querySelector("h1:not(.visually-hidden)");
    (heading || slide).focus({ preventScroll: true });
  }

  function go(nextIndex, direction) {
    const clamped = Math.min(TOTAL, Math.max(1, nextIndex));
    if (clamped === index) return;

    const update = () => applySlide(clamped);
    const canTransition =
      typeof document.startViewTransition === "function" &&
      !reducedMotion() &&
      !narrow();

    if (!canTransition) {
      update();
      focusSlide();
      return;
    }

    try {
      const transition = document.startViewTransition({
        update,
        types: [direction],
      });
      transition.finished.finally(focusSlide);
    } catch {
      const transition = document.startViewTransition(update);
      transition.finished.finally(focusSlide);
    }
  }

  function next() {
    go(index + 1, "forward");
  }

  function prev() {
    go(index - 1, "backward");
  }

  function toggleNotes() {
    if (notesDialog.open) {
      notesDialog.close();
      return;
    }
    syncNotes();
    notesDialog.showModal();
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  document.addEventListener("keydown", (event) => {
    const inDialog = notesDialog.open;
    if (event.key === "n" || event.key === "N") {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      event.preventDefault();
      toggleNotes();
      return;
    }
    if (inDialog) return;

    switch (event.key) {
      case "ArrowRight":
      case "PageDown":
        event.preventDefault();
        next();
        break;
      case " ":
        event.preventDefault();
        if (event.shiftKey) prev();
        else next();
        break;
      case "ArrowLeft":
      case "PageUp":
        event.preventDefault();
        prev();
        break;
      case "Home":
        event.preventDefault();
        go(1, "backward");
        break;
      case "End":
        event.preventDefault();
        go(TOTAL, "forward");
        break;
      default:
        break;
    }
  });

  window.addEventListener("hashchange", () => {
    const nextIndex = parseHash();
    if (nextIndex === index) {
      if (location.hash !== `#${index}`) {
        history.replaceState(null, "", `#${index}`);
      }
      return;
    }
    go(nextIndex, nextIndex > index ? "forward" : "backward");
  });

  stage.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, a, dialog")) return;
    touchStartX = event.clientX;
    touchStartY = event.clientY;
  });

  stage.addEventListener("pointerup", (event) => {
    if (event.target.closest("button, a, dialog")) return;
    const dx = event.clientX - touchStartX;
    const dy = event.clientY - touchStartY;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else prev();
  });

  window.addEventListener("resize", scaleStage);

  progressTotal.textContent = String(TOTAL);
  scaleStage();
  applySlide(parseHash(), { hash: true });
  focusSlide();
})();
