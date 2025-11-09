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

const addRecurringAvailability = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;
    const { dayOfWeek, startTime, endTime } = req.body;
    const recurring = await availabilityService.addRecurringAvailability(userId, {
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
    });
    res.json({ recurring });
  } catch (e) {
    next(e);
  }
};

const getMyRecurringAvailability = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;
    const recurring = await availabilityService.getMyRecurringAvailability(userId);
    res.json({ recurring });
  } catch (e) {
    next(e);
  }
};

const updateRecurringAvailability = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;
    const { id } = req.params;
    const updates = req.body;
    const recurring = await availabilityService.updateRecurringAvailability(
      userId,
      Number(id),
      updates
    );
    res.json({ recurring });
  } catch (e) {
    next(e);
  }
};

const deleteRecurringAvailability = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;
    const { id } = req.params;
    const result = await availabilityService.deleteRecurringAvailability(userId, Number(id));
    res.json(result);
  } catch (e) {
    next(e);
  }
};

const generateSlotsFromRecurring = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;
    const { weeksAhead } = req.body;
    const created = await availabilityService.generateSlotsFromRecurring(
      userId,
      weeksAhead || 4
    );
    res.json({ created, count: created.length });
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
  addRecurringAvailability,
  getMyRecurringAvailability,
  updateRecurringAvailability,
  deleteRecurringAvailability,
  generateSlotsFromRecurring,
};

