const availabilityService = require('../services/availabilityService');

const addMySlots = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;
    const slots = req.body?.slots || [];
    const created = await availabilityService.addSlots(userId, slots);
    res.json({ created });
  } catch (e) {
    next(e);
  }
};

const listForUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { start, end } = req.query;
    const list = await availabilityService.listUserAvailability(Number(userId), { start, end });
    res.json({ availability: list });
  } catch (e) {
    next(e);
  }
};

const removeMySlot = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;
    const { id } = req.params;
    const result = await availabilityService.removeSlot(userId, Number(id));
    res.json(result);
  } catch (e) {
    next(e);
  }
};

const subscribeAlert = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;
    const { targetUserId } = req.params;
    const rec = await availabilityService.subscribeAlert(Number(userId), Number(targetUserId));
    res.json({ alert: rec });
  } catch (e) {
    next(e);
  }
};

const unsubscribeAlert = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;
    const { targetUserId } = req.params;
    const result = await availabilityService.unsubscribeAlert(Number(userId), Number(targetUserId));
    res.json(result);
  } catch (e) {
    next(e);
  }
};

const getAlertStatus = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;
    const { targetUserId } = req.params;
    const status = await availabilityService.getAlertStatus(Number(userId), Number(targetUserId));
    res.json(status);
  } catch (e) {
    next(e);
  }
};

const getMySubscriptions = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;
    const subscriptions = await availabilityService.getMySubscriptions(Number(userId));
    res.json({ subscriptions });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addMySlots,
  listForUser,
  removeMySlot,
  subscribeAlert,
  unsubscribeAlert,
  getAlertStatus,
  getMySubscriptions,
};

