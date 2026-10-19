/**
 * Cognition Partner viewport fit
 * Page card fills the shell. Bars keep established fixed heights (CSS vars).
 * No transform-scale — scale blew up vw-based chrome and caused bar overlap.
 */
(function () {
  var WRAP_SEL = '.site-wrap';
  var CARD_SEL = '.page-card, .cp-r1-card';
  var IMG_SEL = '.page-image, .cp-r1-image';
  var scheduled = null;

  function fit() {
    var wrap = document.querySelector(WRAP_SEL);
    var card = document.querySelector(CARD_SEL);
    if (!wrap || !card) return;

    wrap.classList.add('cp-viewport-shell');
    card.classList.add('cp-design-stage');

    var cs = window.getComputedStyle(wrap);
    var padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
    var padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    var aw = Math.max(0, wrap.clientWidth - padX);
    var ah = Math.max(0, wrap.clientHeight - padY);
    if (aw < 2 || ah < 2) return;

    // Fill shell exactly — bars positioned in %/px of this box
    card.style.boxSizing = 'border-box';
    card.style.width = aw + 'px';
    card.style.height = ah + 'px';
    card.style.maxWidth = '100%';
    card.style.maxHeight = '100%';
    card.style.minWidth = '0';
    card.style.minHeight = '0';
    card.style.margin = '0';
    card.style.flex = '0 0 auto';
    card.style.aspectRatio = 'auto';
    card.style.transform = 'none';

    var img = card.querySelector(IMG_SEL);
    if (img) {
      // Match bar side edges (--cp-bar-side-inset: 3.2%)
      img.style.position = 'absolute';
      img.style.left = 'var(--cp-bar-side-inset)';
      img.style.right = 'var(--cp-bar-side-inset)';
      img.style.width = 'calc(100% - (var(--cp-bar-side-inset) * 2))';
      img.style.top = '0';
      img.style.bottom = '0';
      img.style.height = 'auto';
      img.style.maxHeight = '100%';
      img.style.objectFit = 'cover';
      img.style.objectPosition = 'center center';
      img.style.transform = 'none';
      img.style.pointerEvents = 'none';
      img.style.zIndex = '0';
    }

    document.documentElement.style.setProperty('--cp-frame-w', aw + 'px');
    document.documentElement.style.setProperty('--cp-frame-h', ah + 'px');
    document.documentElement.classList.add('cp-fit-ready');
    document.documentElement.classList.add('cp-frame-fit-ready');
  }

  function schedule() {
    if (scheduled) cancelAnimationFrame(scheduled);
    scheduled = requestAnimationFrame(function () {
      scheduled = null;
      fit();
    });
  }

  function bind() {
    schedule();
    var img = document.querySelector(IMG_SEL);
    if (img && img.dataset.cpFitBound !== '1') {
      img.dataset.cpFitBound = '1';
      img.addEventListener('load', schedule);
    }
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    if (typeof ResizeObserver !== 'undefined') {
      var wrap = document.querySelector(WRAP_SEL);
      if (wrap) new ResizeObserver(schedule).observe(wrap);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
