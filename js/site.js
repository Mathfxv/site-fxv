document.querySelectorAll('form.form').forEach(function (form) {
  var page = form.querySelector('input[name="Page"]');
  var names = { '/': 'Accueil', '/remise-en-forme': 'Remise en forme', '/athletes': 'Athlètes', '/coaching-en-ligne': 'Coaching en ligne' };
  var path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  if (page) page.value = path.indexOf('/blogue') === 0
    ? 'Blogue : ' + document.title.split(' | ')[0]
    : 'Page ' + (names[path] || path);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = Array.prototype.every.call(form.querySelectorAll('input[required]'), function (el) { return el.value.trim() !== ''; });
    var err = form.querySelector('.form-error');
    err.textContent = 'Remplissez votre nom, votre téléphone et votre courriel pour envoyer la demande.';
    err.hidden = ok;
    if (!ok) return;
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Envoi en cours';
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString() })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.querySelector('.form-fields').hidden = true;
        form.querySelector('.form-done').hidden = false;
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = 'Envoyer ma demande';
        err.textContent = "La demande n'est pas partie. Réessayez, ou appelez-nous au 819 434-2143.";
        err.hidden = false;
      });
  });
});

(function () {
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('menu-mobile');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
  });
})();
