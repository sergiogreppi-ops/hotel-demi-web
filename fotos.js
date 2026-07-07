(function () {
  var grid = document.getElementById('fotosGrid');
  var items = Array.prototype.slice.call(grid.querySelectorAll('img'));
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');
  var index = 0;

  function open(i) {
    index = i;
    lightboxImg.src = items[index].src;
    lightboxImg.alt = items[index].alt;
    lightbox.hidden = false;
  }
  function close() { lightbox.hidden = true; }
  function nav(dir) {
    index = (index + dir + items.length) % items.length;
    lightboxImg.src = items[index].src;
    lightboxImg.alt = items[index].alt;
  }

  items.forEach(function (img, i) {
    img.addEventListener('click', function () { open(i); });
  });
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
  prevBtn.addEventListener('click', function (e) { e.stopPropagation(); nav(-1); });
  nextBtn.addEventListener('click', function (e) { e.stopPropagation(); nav(1); });

  window.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') nav(-1);
    if (e.key === 'ArrowRight') nav(1);
  });
})();
