const { Router } = require('express');
const { isLoggedIn } = require('../middlewares/authMiddleware');
const meetingsController = require('../controllers/meetingsController');
const { generateToken04 } = require('../lib/zegoToken');
const { isMeetingParticipant } = require('../middlewares/meetingMiddleware');
const { Op } = require('sequelize');

let rateLimit;
try {
  const mod = require('express-rate-limit');
  rateLimit = mod.default || mod;
} catch (e) {
  rateLimit = null;
}

const router = Router();


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

router.get('/get-meeting-id', isLoggedIn, limiter, async (req, res) => {
  try {
    const myId = req.session.user.id;
    const otherId = req.query.otherId;
    const meeting = await Meeting.findOne({
      where: {
        id: meetingIdNum,
        status: 'scheduled',
        [Op.or]: [
          { hostId: myId, guestId: otherId },
          { hostId: otherId, guestId: myId }
        ],
        startTime: { [Op.lte]: new Date(Date.now() + 5 * 60 * 1000) },
        endTime: { [Op.gt]: new Date() }
      }
    });
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const { roomId } = req.meeting;
    res.json({ roomId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'failed_to_create_token' });
  }
});
router.get('/:meetingId/join-token', isLoggedIn, isMeetingParticipant, limiter, (req, res) => {
  try {
    const appId = Number(process.env.ZEGO_APP_ID);
    const secret = process.env.ZEGO_SERVER_SECRET;
    const ttl = Number(process.env.TOKEN_TTL_SECONDS || 3600);

    
    const { roomId } = req.meeting;
    const userId = String(req.session.user?.id || 'guest').slice(0, 64);
    const userName = String(req.session.user?.username || 'Guest').slice(0, 64);

    const token = generateToken04(appId, userId, secret, ttl, '');
    res.json({ appId, token, roomId, userId, userName });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'failed_to_create_token' });
  }
});

router.post('/schedule', isLoggedIn, meetingsController.schedule);


router.patch('/:id/cancel', isLoggedIn, meetingsController.cancel);


router.get('/my', isLoggedIn, meetingsController.listMine);

module.exports = router;
