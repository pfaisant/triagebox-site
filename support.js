/* Anonymous public likes. No IP lookup, analytics events or donation-click logging. */
(() => {
  const ENDPOINT = 'https://triagebox.pfa87.cc/api/support-likes';
  const KEY = 'triagebox-public-like-token-v1';
  const validToken = (value) => typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  const button = document.getElementById('like-btn');
  const count = document.getElementById('like-count');
  const hint = document.getElementById('like-hint');
  const label = document.getElementById('like-label');
  const retry = document.getElementById('like-retry');
  const live = document.getElementById('support-status');
  const api = location.hostname === '127.0.0.1' ? '/api/support-likes' : ENDPOINT;
  let token = '';
  let liked = false;
  let ready = false;
  let busy = false;
  let refreshPending = false;
  try {
    token = localStorage.getItem(KEY) || '';
    if (!validToken(token)) {
      token = crypto.randomUUID();
      localStorage.setItem(KEY, token);
    }
    localStorage.removeItem('triagebox-donate-liked');
    localStorage.removeItem('triagebox-stats-buffer');
  } catch { token = ''; }

  function paint(data) {
    if (!data || data.ok !== true || !Number.isSafeInteger(data.count) || data.count < 0
      || typeof data.liked !== 'boolean' || (data.liked && (!token || data.count === 0))) throw new Error('Invalid count');
    liked = data.liked;
    ready = true;
    count.textContent = data.count.toLocaleString();
    button.setAttribute('aria-pressed', String(liked));
    label.textContent = liked ? 'Liked · thank you' : 'Like TriageBox';
    hint.textContent = token ? 'Public likes · click again to undo your like.' : 'Public likes · browser storage is needed to remember your vote.';
    retry.hidden = true;
  }

  async function request(next) {
    if (busy) {
      if (typeof next !== 'boolean') refreshPending = true;
      return;
    }
    busy = true;
    const requestToken = token;
    button.disabled = true;
    retry.disabled = true;
    try {
      const writing = typeof next === 'boolean';
      const response = await fetch(api + (!writing && requestToken ? '?token=' + encodeURIComponent(requestToken) : ''), {
        method: writing ? 'PUT' : 'GET', credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store',
        signal: AbortSignal.timeout(8000),
        ...(writing ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: requestToken, liked: next }) } : {})
      });
      if (!response.ok) throw new Error('Counter unavailable');
      const data = await response.json();
      if (requestToken !== token) return;
      paint(data);
      if (writing) live.textContent = liked ? 'Thank you. Your like is included in the public total.' : 'Your like was removed from the public total.';
    } catch {
      if (requestToken !== token) return;
      ready = false;
      count.textContent = '—';
      button.setAttribute('aria-pressed', 'mixed');
      label.textContent = 'Like status unavailable';
      hint.textContent = 'Public count unavailable. Retry to check whether your like was saved.';
      live.textContent = hint.textContent;
      retry.hidden = false;
    } finally {
      busy = false;
      button.disabled = !ready || !token;
      retry.disabled = false;
      if (refreshPending) {
        refreshPending = false;
        void request();
      }
    }
  }
  button.addEventListener('click', () => { if (ready && token) void request(!liked); });
  retry.addEventListener('click', () => { void request(); });
  window.addEventListener('focus', () => { void request(); });
  window.addEventListener('storage', (event) => {
    if (event.key === KEY || event.key === null) {
      token = validToken(event.newValue) ? event.newValue : '';
      ready = false;
      button.disabled = true;
      button.setAttribute('aria-pressed', 'mixed');
      label.textContent = 'Checking your like…';
      count.textContent = '—';
      void request();
    }
  });
  void request();

  document.getElementById('copy-bitcoin').addEventListener('click', async () => {
    const address = document.getElementById('bitcoin-address');
    try {
      await navigator.clipboard.writeText(address.value);
      document.getElementById('copy-status').textContent = 'Address copied.';
      live.textContent = 'Bitcoin address copied.';
    } catch {
      address.focus(); address.select();
      document.getElementById('copy-status').textContent = 'Select and copy the address above.';
    }
  });
  document.getElementById('share-project').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('https://triagebox.pfa87.cc/');
      document.getElementById('share-status').textContent = 'Link copied. Thank you for sharing.';
      live.textContent = 'TriageBox link copied.';
    } catch {
      document.getElementById('share-status').textContent = 'Share this link: https://triagebox.pfa87.cc/';
      live.textContent = 'Could not copy. The link is shown under Share with a friend.';
    }
  });
})();
