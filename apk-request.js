// apk-request.js — the Android APK request form. Builds a pre-filled mailto so the visitor's
// own mail app sends the request; the site stores nothing and has no form backend.
(function () {
  var form = document.getElementById('apk-request');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var value = function (name) { var el = form.elements[name]; return el && el.value ? el.value.trim() : ''; };
    var body = [
      'Hello Paul,',
      '',
      'Please send me the TriageBox Android APK.',
      'Reply to: ' + value('reply'),
      'Phone and Android version: ' + value('phone'),
      value('why') ? 'Why: ' + value('why') : '',
      '',
      'Sent from https://triagebox.pfa87.cc/#android'
    ].filter(function (line) { return line !== null; }).join('\n');
    window.location.href = 'mailto:paulfaisant@gmail.com?subject=' + encodeURIComponent('TriageBox Android APK request') + '&body=' + encodeURIComponent(body);
  });
})();
