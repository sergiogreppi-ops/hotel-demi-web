// ===== Reveal on scroll =====
(function () {
  var els = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 0.12 + 's';
    io.observe(el);
  });
})();

// ===== Carousel =====
(function () {
  var carousel = document.getElementById('carousel');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  if (!carousel) return;

  function step(dir) {
    var item = carousel.querySelector('.carousel-item');
    var width = item ? item.getBoundingClientRect().width + 20 : 360;
    carousel.scrollBy({ left: dir * width, behavior: 'smooth' });
  }
  if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });

  // Autoplay, stops on first manual interaction
  var timer = setInterval(function () {
    var atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;
    if (atEnd) carousel.scrollTo({ left: 0, behavior: 'smooth' });
    else carousel.scrollBy({ left: 380, behavior: 'smooth' });
  }, 4500);
  carousel.addEventListener('pointerdown', function stop() {
    clearInterval(timer);
    carousel.removeEventListener('pointerdown', stop);
  }, { once: true });
})();

// ===== Parallax hero =====
(function () {
  var textEl = document.querySelector('[data-parallax="text"]');
  var imgEl = document.querySelector('[data-parallax="img"]');
  if (!textEl && !imgEl) return;
  var raf = null;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      var y = window.scrollY;
      var vh = window.innerHeight || 1;
      var p = Math.min(y / vh, 1.2);
      if (textEl) {
        textEl.style.transform = 'translateY(' + (y * 0.42) + 'px)';
        textEl.style.opacity = String(Math.max(1 - p * 1.35, 0));
      }
      if (imgEl) {
        var scale = Math.max(1 - p * 0.06, 0.94);
        imgEl.style.transform = 'translateY(' + (y * 0.18) + 'px) scale(' + scale + ')';
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ===== Chatbot panel =====
(function () {
  var panel = document.getElementById('chatPanel');
  var toggle = document.getElementById('chatToggle');
  var close = document.getElementById('chatClose');
  if (!panel || !toggle) return;

  var isOpen = false;

  function repositionForKeyboard() {
    var vv = window.visualViewport;
    if (!vv) return;
    var isMobile = window.innerWidth < 720;
    if (isMobile && isOpen) {
      var gapFromBottom = window.innerHeight - (vv.height + vv.offsetTop);
      panel.style.bottom = (gapFromBottom + 8) + 'px';
      panel.style.height = Math.min(vv.height - 90, 560) + 'px';
    } else {
      panel.style.bottom = '158px';
      panel.style.height = '';
    }
  }

  toggle.addEventListener('click', function () {
    isOpen = !isOpen;
    panel.hidden = !isOpen;
    repositionForKeyboard();
  });
  if (close) close.addEventListener('click', function () {
    isOpen = false;
    panel.hidden = true;
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', repositionForKeyboard);
    window.visualViewport.addEventListener('scroll', repositionForKeyboard);
  }
})();
