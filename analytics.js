/* Google Analytics 4 for the public TriageBox website only.
   Consent Mode v2 defaults to denied before gtag.js is requested. The site sends
   cookieless measurement pings until the visitor accepts; advertising signals
   remain denied in every state. This file is not included in the extension. */
(function () {
  'use strict';

  var ID = 'G-KVV7QW9D5E';
  var KEY = 'triagebox-analytics-consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function remember(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* Ask again next visit. */ }
  }

  function clearAnalyticsCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host];
    var parent = host.split('.').slice(-2).join('.');
    if (parent && parent !== host) domains.push('.' + parent);

    document.cookie.split(';').forEach(function (part) {
      var name = part.split('=')[0].trim();
      if (name !== '_ga' && name.indexOf('_ga_') !== 0) return;
      domains.forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' +
          (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      });
    });
  }

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);

  var choice = stored();
  if (choice === 'granted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }

  gtag('js', new Date());
  gtag('config', ID);

  var library = document.createElement('script');
  library.async = true;
  library.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(library);

  var style = document.createElement('style');
  style.textContent =
    '.tb-cookie-settings{position:fixed;left:12px;bottom:12px;z-index:9998;border:1px solid rgba(127,127,127,.4);border-radius:999px;padding:7px 11px;background:#111b17;color:#d7e5de;font:600 12px/1.2 system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.2)}' +
    '.tb-consent[hidden]{display:none}.tb-consent{position:fixed;inset:0;z-index:9999;display:grid;place-items:end center;padding:18px;background:rgba(0,0,0,.55)}' +
    '.tb-consent__card{width:min(620px,100%);border:1px solid #315746;border-radius:16px;padding:20px;background:#0d1814;color:#d7e5de;box-shadow:0 24px 64px rgba(0,0,0,.45);font:15px/1.5 system-ui,sans-serif}' +
    '.tb-consent__card h2{margin:0 0 7px;color:#eefaf4;font-size:20px}.tb-consent__card p{margin:0 0 15px;color:#bfd1c8}' +
    '.tb-consent__card a{color:#5eead4}.tb-consent__actions{display:flex;flex-wrap:wrap;gap:9px}' +
    '.tb-consent__actions button{border:1px solid #3b6653;border-radius:9px;padding:9px 14px;background:#14251e;color:#e7f5ee;font:700 14px/1.2 system-ui,sans-serif;cursor:pointer}' +
    '.tb-consent__actions button[data-consent="granted"]{border-color:#24a875;background:#0a8a5f;color:#fff}' +
    '.tb-consent__dismiss{margin-left:auto!important;background:transparent!important;border-color:transparent!important;color:#a9bbb2!important}' +
    '@media(max-width:520px){.tb-consent{padding:10px}.tb-consent__card{padding:17px}.tb-consent__dismiss{margin-left:0!important}}';
  document.head.appendChild(style);

  var settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'tb-cookie-settings';
  settings.textContent = 'Cookie settings';

  var banner = document.createElement('div');
  banner.className = 'tb-consent';
  banner.hidden = true;
  banner.innerHTML =
    '<section class="tb-consent__card" role="dialog" aria-modal="true" aria-labelledby="tb-consent-title">' +
      '<h2 id="tb-consent-title">Website analytics</h2>' +
      '<p>We use Google Analytics to understand visits to this public website. ' +
      'Analytics cookies are set only if you accept. Advertising storage stays off. ' +
      '<a href="./privacy.html#website-analytics">Privacy details</a>.</p>' +
      '<div class="tb-consent__actions">' +
        '<button type="button" data-consent="granted">Accept analytics</button>' +
        '<button type="button" data-consent="denied">Decline</button>' +
        '<button type="button" class="tb-consent__dismiss" data-dismiss>Not now</button>' +
      '</div>' +
    '</section>';

  function open() {
    banner.hidden = false;
    var first = banner.querySelector('[data-consent]');
    if (first) first.focus();
  }

  function close() {
    banner.hidden = true;
    settings.focus();
  }

  function decide(value) {
    remember(value);
    gtag('consent', 'update', {
      analytics_storage: value === 'granted' ? 'granted' : 'denied'
    });
    if (value === 'denied') clearAnalyticsCookies();
    close();
  }

  banner.addEventListener('click', function (event) {
    var decision = event.target.closest('[data-consent]');
    if (decision) return decide(decision.getAttribute('data-consent'));
    if (event.target.closest('[data-dismiss]') || event.target === banner) close();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !banner.hidden) close();
  });
  settings.addEventListener('click', open);

  document.body.appendChild(settings);
  document.body.appendChild(banner);
  if (choice !== 'granted' && choice !== 'denied') open();
})();
