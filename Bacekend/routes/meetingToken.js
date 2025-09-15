// Note: This project uses CommonJS. If switching to ES Modules, replace
// require/module.exports with import/export accordingly.
const { Router } = require('express');
const { generateToken04 } = require('../lib/zegoToken');

let rateLimit;
try {

  const mod = require('express-rate-limit');
  rateLimit = mod.default || mod;
} catch (e) {
  rateLimit = null;
}
try {
  if (typeof generateToken04 === 'function') {
    console.log("Is function");
  }
} catch (_) {
    console.log("Not function");
}

// const { authOptional } = require('../middlewares/authOptional');
// const { isParticipant } = require('../services/meetingMembership');

const router = Router();

// Gentle rate limiter for token endpoint
let limiter;
if (rateLimit) {
  limiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
} else {
  // Fallback simple limiter per IP in memory (DEV only)
  const hits = new Map();
  const windowMs = 60 * 1000;
  const max = 30;
  limiter = function (req, res, next) {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    if (!hits.has(ip)) hits.set(ip, []);
    const arr = hits.get(ip).filter((t) => now - t < windowMs);
    arr.push(now);
    hits.set(ip, arr);
    if (arr.length > max) return res.status(429).json({ error: 'Too many requests' });
    next();
  };
}

router.get("/:meetingId/join-token", (req, res) => {
  try {
    const appId = Number(process.env.ZEGO_APP_ID);
    const secret = process.env.ZEGO_SERVER_SECRET; // אורך 32 נפוץ
    const ttl = Number(process.env.TOKEN_TTL_SECONDS || 3600);

    const { meetingId } = req.params;
    const userId = String(req.session.user.id || "No have Id").slice(0, 64);
    const userName = String(req.session.user.username || "No have Username").slice(0, 64);

    const token = generateToken04(appId, userId, secret, ttl, "");
    res.json({ appId, token, roomId: String(meetingId), userId, userName });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "failed_to_create_token" });
  }
});

module.exports = router;
