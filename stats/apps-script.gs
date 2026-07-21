/**
 * triageBox donate-page stats logger
 * ----------------------------------
 * Saves IP + geo + action rows into a private Google Sheet for statistics.
 *
 * Setup (about 2 minutes):
 * 1. Create a new Google Sheet (e.g. "triageBox donate stats").
 * 2. Extensions → Apps Script, paste this file, Save.
 * 3. Deploy → New deployment → Type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the Web app URL.
 * 5. Paste it into donate.html as STATS_ENDPOINT (const near the top of the script).
 * 6. Reload the Sheet; the header row is created on the first event.
 *
 * Columns: Timestamp | Action | IP | Country | CountryCode | City | Path | Referrer | UserAgent
 */

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Action',
        'IP',
        'Country',
        'CountryCode',
        'City',
        'Path',
        'Referrer',
        'UserAgent',
      ]);
    }

    sheet.appendRow([
      data.ts || new Date().toISOString(),
      data.action || '',
      data.ip || '',
      data.country || '',
      data.countryCode || '',
      data.city || '',
      data.path || '',
      data.referrer || '',
      data.ua || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'triagebox-stats' }))
    .setMimeType(ContentService.MimeType.JSON);
}
