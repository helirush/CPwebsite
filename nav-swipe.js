(() => {
  const { prev, next } = document.body.dataset;
  const threshold = 50;
  let startX = 0;
  let startY = 0;
  let tracking = false;

  const goPrev = () => {
    if (prev) window.location.href = prev;
  };

  const goNext = () => {
    if (next) window.location.href = next;
  };

  window.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) return;
      tracking = true;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    (event) => {
      if (!tracking || event.changedTouches.length !== 1) return;
      tracking = false;
      const deltaX = event.changedTouches[0].clientX - startX;
      const deltaY = event.changedTouches[0].clientY - startY;
      if (Math.abs(deltaX) < threshold) return;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
      if (deltaX < 0) goNext();
      if (deltaX > 0) goPrev();
    },
    { passive: true }
  );

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goPrev();
    if (event.key === "ArrowRight") goNext();
  });
})();
