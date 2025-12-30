// --- CONFIG ---
const CONFIG = {
  contactSheet: 'Sheet1',
  logSheet: 'Sheet2',
  allowedOrigin: 'https://mrpatchara.github.io/Patchara_Al-umaree.com', // เปลี่ยนเป็นโดเมนของคุณ
  sharedSecret: '1ij9A6dSyncj7NdfTZdw-1wPhzp0s3wN6jzo80_QsWHU',         // เปลี่ยนเป็น token ที่คุณกำหนด
  maxBodyBytes: 10000
};

// --- MAIN ENTRYPOINT ---
function doPost(e) {
  try {
    if (!e || !e.postData) return buildResponse_(400);

    // --- Security checks ---
    if ((e.postData.length || 0) > CONFIG.maxBodyBytes) return buildResponse_(413);
    const ct = e.postData.type || '';
    let data = {};
    if (ct.indexOf('application/json') !== -1) {
      data = JSON.parse(e.postData.contents || '{}');
    } else {
      data = e.parameter || {};
    }

    // Secret token (header หรือ body)
    const token = (e?.headers && (e.headers['x-form-token'] || e.headers['X-Form-Token'])) || data.token;
    if (token !== CONFIG.sharedSecret) return buildResponse_(401);

    // Origin check
    if (CONFIG.allowedOrigin && data.origin && data.origin !== CONFIG.allowedOrigin)
      return buildResponse_(403);

    // Honeypot (field ซ่อน ถ้ามีค่า = bot)
    if (data.honey && data.honey.length > 0) return buildResponse_(200); // fake ok

    // --- Dispatch ---
    if (data.action === 'contact') {
      return handleContact_(data, e);
    } else if (data.action === 'log') {
      return handleLog_(data, e);
    } else {
      return buildResponse_(400);
    }
  } catch (err) {
    return buildResponse_(500);
  }
}

// --- CONTACT FORM HANDLER ---
function handleContact_(data, e) {
  // Validate
  if (!data.name || !data.email || !data.message) return buildResponse_(400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return buildResponse_(400);
  if ((data.message || '').length > 2000) return buildResponse_(400);

  // Simple rate limit: sessionId + timestamp (1 นาที/ครั้ง)
  const cache = CacheService.getScriptCache();
  if (data.sessionId) {
    const key = 'contact_' + data.sessionId;
    if (cache.get(key)) return buildResponse_(429);
    cache.put(key, '1', 60); // 1 นาที
  }

  // Write to sheet
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.contactSheet);
  const lock = LockService.getScriptLock();
  lock.tryLock(5000);
  const now = new Date();
  sheet.appendRow([
    now,
    data.name || '',
    data.email || '',
    data.phone || '',
    data.subject || '',
    data.message || '',
    data.userAgent || '',
    data.referrer || '',
    data.origin || '',
    data.token || '',
    'ok',
    ''
  ]);
  lock.releaseLock();

  // Send email
  MailApp.sendEmail({
    to: 'patcharaalumaree@gmail.com',
    subject: `[Contact] ${data.subject || 'No subject'}`,
    body: buildMailBody_(data, now)
  });

  return buildResponse_(200);
}

// --- PAGE LOG HANDLER ---
function handleLog_(data, e) {
  // Simple rate limit: sessionId + timestamp (10 วินาที/ครั้ง)
  const cache = CacheService.getScriptCache();
  if (data.sessionId) {
    const key = 'log_' + data.sessionId;
    if (cache.get(key)) return buildResponse_(429);
    cache.put(key, '1', 10); // 10 วินาที
  }

  // Write to log sheet
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.logSheet);
  const lock = LockService.getScriptLock();
  lock.tryLock(5000);
  const now = new Date();
  sheet.appendRow([
    now,
    data.page || '',
    data.userAgent || '',
    data.referrer || '',
    '', // IP (GAS ไม่ได้)
    data.origin || '',
    data.sessionId || '',
    ''
  ]);
  lock.releaseLock();

  return buildResponse_(200);
}

// --- EMAIL BODY ---
function buildMailBody_(d, now) {
  return [
    `Time: ${now}`,
    `Name: ${d.name || ''}`,
    `Email: ${d.email || ''}`,
    `Phone: ${d.phone || ''}`,
    `Subject: ${d.subject || ''}`,
    `Message:`,
    d.message || ''
  ].join('\n');
}

// --- RESPONSE ---
function buildResponse_(code) {
  // ไม่ส่งรายละเอียด error
  const msg = (code === 200) ? 'ok' : 'error';
  return ContentService.createTextOutput(JSON.stringify({ message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}