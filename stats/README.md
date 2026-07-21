# Donate page statistics (IP log)

The donate page records lightweight events so you can build stats later:

| Action  | When                                      | Fields                                      |
|---------|-------------------------------------------|---------------------------------------------|
| `view`  | First load of the page in a browser tab session | IP, country, city, path, referrer, UA, time |
| `like`  | User clicks Like                          | same                                        |
| `unlike`| User clicks again to undo                 | same                                        |

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
