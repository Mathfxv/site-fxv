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
        if (window.fbq) fbq('track', 'Lead');
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

/* Témoins et Pixel Meta : désactivés par défaut (Loi 25), chargés seulement après « Accepter ». */
(function () {
  var KEY = 'fxv-temoins', PIXEL = '719467979503341';
  function lire() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function ecrire(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function chargerPixel() {
    if (window.fbq) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL);
    fbq('track', 'PageView');
  }
  var bandeau;
  function afficher() {
    if (bandeau) { bandeau.hidden = false; return; }
    bandeau = document.createElement('div');
    bandeau.className = 'temoins';
    bandeau.setAttribute('role', 'region');
    bandeau.setAttribute('aria-label', 'Témoins');
    bandeau.innerHTML = '<p>Nous utilisons des témoins et le Pixel Meta pour mesurer l\'efficacité de nos publicités. Ils restent désactivés si vous refusez. <a href="/confidentialite">En savoir plus</a></p>' +
      '<div class="temoins__actions"><button type="button" class="btn btn-light" data-choix="non">Refuser</button>' +
      '<button type="button" class="btn btn-primary" data-choix="oui">Accepter</button></div>';
    bandeau.addEventListener('click', function (e) {
      var c = e.target.getAttribute('data-choix');
      if (!c) return;
      ecrire(c);
      bandeau.hidden = true;
      if (c === 'oui') chargerPixel();
      else if (window.fbq) fbq('consent', 'revoke');
    });
    document.body.appendChild(bandeau);
  }
  var bas = document.querySelector('.footer-bottom');
  if (bas) {
    var lien = document.createElement('button');
    lien.type = 'button'; lien.className = 'lien-temoins'; lien.textContent = 'Gérer les témoins';
    lien.addEventListener('click', afficher);
    bas.appendChild(document.createTextNode(' · '));
    bas.appendChild(lien);
  }
  var choix = lire();
  if (choix === 'oui') chargerPixel();
  else if (choix !== 'non') afficher();
})();
