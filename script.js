// Marca que JS cargó: recién ahí el CSS oculta los .reveal (fallback sin JS)
document.documentElement.classList.add('js');

// ===== Menú móvil =====
(function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  if (!toggle || !nav) return;
  function setOpen(open) {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  toggle.addEventListener('click', function () {
    setOpen(!document.body.classList.contains('nav-open'));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setOpen(false);
  });
})();

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

  // Indicador de posición (sin autoplay: el usuario controla el scroll)
  var dotsWrap = document.getElementById('carouselDots');
  if (dotsWrap) {
    var items = carousel.querySelectorAll('.carousel-item');
    var dots = [];
    items.forEach(function () {
      var d = document.createElement('span');
      dotsWrap.appendChild(d);
      dots.push(d);
    });
    var raf = null;
    function updateDots() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        var center = carousel.scrollLeft + carousel.clientWidth / 2;
        var best = 0, bestDist = Infinity;
        items.forEach(function (it, i) {
          var mid = it.offsetLeft + it.offsetWidth / 2;
          var dist = Math.abs(mid - center);
          if (dist < bestDist) { bestDist = dist; best = i; }
        });
        dots.forEach(function (d, i) { d.classList.toggle('active', i === best); });
      });
    }
    carousel.addEventListener('scroll', updateDots, { passive: true });
    updateDots();
  }
})();

// ===== Parallax hero =====
(function () {
  var textEl = document.querySelector('[data-parallax="text"]');
  var imgEl = document.querySelector('[data-parallax="img"]');
  if (!textEl && !imgEl) return;
  // En móvil y con reduced-motion el parallax genera jank y desvanece el texto: no se activa
  if (window.matchMedia('(max-width: 719px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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

  // En móvil el panel abre a pantalla completa (CSS), así que no hace falta
  // reposicionar nada con el teclado: el layout interno del bot lo maneja.
  var isOpen = false;

  function setOpen(open) {
    isOpen = open;
    panel.hidden = !open;
    document.body.classList.toggle('chat-open', open);
  }

  toggle.addEventListener('click', function () { setOpen(!isOpen); });
  if (close) close.addEventListener('click', function () { setOpen(false); });
})();
