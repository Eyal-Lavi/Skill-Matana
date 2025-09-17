const { Router } = require('express');
const { isLoggedIn } = require('../middlewares/authMiddleware');
const meetingsController = require('../controllers/meetingsController');
const { generateToken04 } = require('../lib/zegoToken');
const {isMeetingParticipant} = require('../middlewares/meetingMiddleware');
// Optional rate limiter (fallback simple impl if package missing)
let rateLimit;
try {
  const mod = require('express-rate-limit');
  rateLimit = mod.default || mod;
} catch (e) {
  rateLimit = null;
}

const router = Router();

// Public: join token for Zego (keep path compatibility)
let limiter;
if (rateLimit) {
  limiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
} else {
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

router.get('/:meetingId/join-token',isLoggedIn,isMeetingParticipant, limiter, (req, res) => {
  try {
    const appId = Number(process.env.ZEGO_APP_ID);
    const secret = process.env.ZEGO_SERVER_SECRET;
    const ttl = Number(process.env.TOKEN_TTL_SECONDS || 3600);

    // const { meetingId } = req.params;
    const meetingId = req.meeting;
    const userId = String(req.session.user?.id || 'guest').slice(0, 64);
    const userName = String(req.session.user?.username || 'Guest').slice(0, 64);

    const token = generateToken04(appId, userId, secret, ttl, '');
    res.json({ appId, token, roomId: String(meetingId), userId, userName });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'failed_to_create_token' });
  }
});

// Schedule a meeting with a user using an availability slot
router.post('/schedule', isLoggedIn, meetingsController.schedule);

// Cancel a meeting (participant only)
router.patch('/:id/cancel', isLoggedIn, meetingsController.cancel);

// List my meetings
router.get('/my', isLoggedIn, meetingsController.listMine);

module.exports = router;
