// Marca que JS cargó: recién ahí el CSS oculta los .reveal (fallback sin JS)
document.documentElement.classList.add('js');

// ===== Abrir el chat desde cualquier CTA [data-open-chat] =====
(function () {
  var panel = document.getElementById('chatPanel');
  var toggle = document.getElementById('chatToggle');
  if (!panel || !toggle) return;
  document.querySelectorAll('[data-open-chat]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (panel.hidden) toggle.click(); // reutiliza el estado del módulo del chat
      document.body.classList.remove('nav-open');
    });
  });
})();

// ===== Opiniones: rota 3 al azar del pool en cada visita =====
(function () {
  var cards = document.querySelectorAll('.review-card');
  if (!cards.length) return;
  var pool = [
    { t: 'Muy buena ubicación, sus dueños muy serviciales y lugar tranquilo. Cerca de la playa.', s: 'Booking.com' },
    { t: 'Excelente relación precio-calidad. Las habitaciones son sencillas pero bien equipadas y muy limpias.', s: 'Tripadvisor' },
    { t: 'Muy buen desayuno, el personal siempre al servicio del cliente, la ubicación inmejorable.', s: 'Booking.com' },
    { t: 'Me encantó el hotel Demi. Simplemente es todo lo que necesitaba. Es un lugar muy tranquilo, limpio y siempre hay alguna persona disponible para ayudarte en lo que necesites.', s: 'Google' },
    { t: 'Todo impecable. Muy cómodo. Excelente ubicación. Atención de la mejor. Hermoso hotel. Cerca de la playa. Desayuno super rico. Muy buen precio.', s: 'Google' },
    { t: 'Estoy muy contenta con la estadía que tuve en el hotel, desde el servicio de desayuno, la atención de los empleados y la habitación.', s: 'Google' },
    { t: 'Excelente ubicación. La habitación tiene lo justo y necesario. La atención del personal es muy buena, muy amables y serviciales.', s: 'Google' }
  ];
  for (var i = pool.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
  }
  cards.forEach(function (card, i) {
    if (!pool[i]) return;
    card.querySelector('blockquote').textContent = '\u201C' + pool[i].t + '\u201D';
    card.querySelector('figcaption').textContent = 'Hu\u00e9sped \u00B7 ' + pool[i].s;
  });
})();

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
