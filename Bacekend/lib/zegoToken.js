// utils/zegoServerAssistant.js
const crypto = require ("crypto");

/**
 * יוצר Token04 עבור ZEGOCLOUD
 * @param {number} _appId              AppID מספרי מ-ZEGOCLOUD
 * @param {string} _userId             מזהה משתמש (עד 64 תווים)
 * @param {string} _serverSecret       מפתח סודי באורך 16/24/32 בתים (ברוב המקרים 32)
 * @param {number} _ttlSeconds         תוקף בשניות (למשל 3600)
 * @param {string} [_payload='']       מידע נוסף להצפנה (לא חובה)
 * @returns {string}                   מחרוזת טוקן שמתחילה ב-"04"
 */
function generateToken04(_appId, _userId, _serverSecret, _ttlSeconds, _payload = "") {
  // ולידציות בסיס
  if (typeof _appId !== "number" || !Number.isFinite(_appId) || _appId <= 0) {
    throw new Error("appId invalid");
  }
  if (typeof _userId !== "string" || _userId.length === 0 || _userId.length > 64) {
    throw new Error("userId invalid (must be 1..64 chars)");
  }
  const secretLen = Buffer.byteLength(_serverSecret || "", "utf8");
  if (![16, 24, 32].includes(secretLen)) {
    throw new Error("serverSecret must be 16/24/32 bytes (utf8)");
  }
  const ttl = Number(_ttlSeconds);
  if (!Number.isInteger(ttl) || ttl <= 0) {
    throw new Error("ttlSeconds invalid");
  }

  // אלגוריתם AES לפי אורך המפתח
  const algorithm = secretLen === 16 ? "aes-128-cbc" : secretLen === 24 ? "aes-192-cbc" : "aes-256-cbc";

  // יצירת נתוני הטוקן
  const nowSec = Math.floor(Date.now() / 1000);
  const tokenInfo = {
    app_id: _appId,
    user_id: String(_userId),
    nonce: makeNonce(),
    ctime: nowSec,
    expire: nowSec + ttl,
    payload: String(_payload || ""),
  };

  const plainText = JSON.stringify(tokenInfo);

  // IV בגודל 16 בתווים בטוחים (כמו בקוד הרשמי)
  const ivStr = makeRandomIv();
  const keyBuf = Buffer.from(_serverSecret, "utf8");
  const ivBuf = Buffer.from(ivStr, "utf8");

  // הצפנה AES-CBC עם Padding
  const cipher = crypto.createCipheriv(algorithm, keyBuf, ivBuf);
  cipher.setAutoPadding(true);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);

  // אריזה לפורמט:
  // [expire:8 bytes BE][ivLen:2 bytes][iv bytes][ctLen:2 bytes][cipher bytes]
  const bExpire = Buffer.alloc(8);
  // דורש Node 12.0+; אם אין, אפשר לפרק ל-2 UINT32
  bExpire.writeBigInt64BE(BigInt(tokenInfo.expire), 0);

  const bIvLen = Buffer.alloc(2);
  bIvLen.writeUInt16BE(ivBuf.length, 0);

  const bCtLen = Buffer.alloc(2);
  bCtLen.writeUInt16BE(encrypted.length, 0);

  const packed = Buffer.concat([bExpire, bIvLen, ivBuf, bCtLen, encrypted]);

  // prefix "04" + Base64
  return "04" + packed.toString("base64");
}

// -------- עזרי רנדום/nonce -------

function makeNonce() {
  // טווח 32-ביט חתום
  const min = -2147483648;
  const max = 2147483647;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeRandomIv() {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < 16; i++) {
    out += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return out;
}

// אם אתה ב-CommonJS, השתמש בזה במקום export:
module.exports = { generateToken04 };
