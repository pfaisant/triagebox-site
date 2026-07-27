# Donate page statistics (IP log)

The donate page records lightweight events so you can build stats later:

| Action   | When                                            | Emails you? | Fields |
|----------|-------------------------------------------------|-------------|--------|
| `view`   | First load of the page in a browser tab session  | **no**      | IP, country, city, path, referrer, UA, device, screen, time |
| `like`   | User clicks Like                                 | yes         | same |
| `unlike` | User clicks again to undo                        | yes         | same |
| `donate` | User clicks a payment link (Revolut, Ko-fi…)     | yes         | same + `target` (the host they left for) |

## What gets emailed, and what it looks like

`EMAIL_EVENTS` in `donate.html` decides. **Views are deliberately not in it**: one email
per visitor is exactly the inbox mess this project exists to fight, and view *counts*
belong in analytics (Cloudflare Web Analytics on the tunnel, or the Sheet below) rather
than in a mailbox. Views are still logged to the Sheet and the local buffer.

Emails carry the facts in the **subject** and in a `message` body, not only in the field
table — the table came out empty on the JSON/AJAX path, so every notification read
"Form submission received … with empty form fields":

```
Subject: triageBox donate — Paris, France — Chrome 141 on macOS

DONATE on /donate.html → revolut.me
When:     2026-07-27 10:13 UTC
Where:    Paris, France — 90.115.108.177
Device:   Chrome 141 on macOS · 1512×982
Came from: https://news.ycombinator.com/
```

The `donate` beacon is sent with `keepalive`, so it survives the navigation to the
payment page — otherwise the single event worth having is the one that never arrives.

Likes are also **de-duplicated by IP** on the public counter (one global like per IP).

## Where data is saved (default)

By default, events go to **[FormSubmit](https://formsubmit.co)** for `paulfaisant@gmail.com`:

1. Open the donate page once (or click Like).
2. Check that inbox for an activation email from FormSubmit and confirm.
3. Later events appear in the FormSubmit dashboard (and by email unless you turn notifications off).
4. Export CSV from FormSubmit when you want to chart unique IPs, countries, likes over time, etc.

A small ring buffer (last 200 events) is also kept in the visitor’s `localStorage` under `triagebox-stats-buffer` (useful only on that device).

## Optional: private Google Sheet (recommended for real stats)

FormSubmit is fine to start; a Sheet is better for pivots and charts.

1. Open `apps-script.gs` in this folder.
2. Follow the setup comments at the top (new Sheet → Apps Script → Deploy as web app → Anyone).
3. In `donate.html`, set:

```js
const STATS_ENDPOINT = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```

When `STATS_ENDPOINT` is set, events go to your Sheet first (private to your Google account). FormSubmit is only used as a fallback if the Sheet request fails.

## Privacy

The Chrome **extension** still collects nothing. This logging applies only to the public **website** donate page. See `privacy.html` for the disclosure.
