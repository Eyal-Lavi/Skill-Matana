const meetingService = require('../services/meetingService');
const { sequelize } = require('../utils/database');


const schedule = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const requesterId = req.session.user?.id;
    const { targetUserId, availabilityId } = req.body || {};

    const mtg = await meetingService.scheduleMeeting(
      Number(requesterId),
      Number(targetUserId),
      Number(availabilityId),
      t 
    );

    await t.commit();
    res.json({ meeting: mtg });
  } catch (e) {
    await t.rollback();
    next(e);
  }
};

const cancel = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.session.user?.id;
    const { id } = req.params;

    const mtg = await meetingService.cancelMeeting(
      Number(id),
      Number(userId),
      t
    );

    await t.commit();
    res.json({ meeting: mtg });
  } catch (e) {
    await t.rollback();
    next(e);
  }
};

const listMine = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;
    const { status } = req.query;
    const list = await meetingService.listMyMeetings(Number(userId), { status });
    
    console.log(`Returning ${list?.length || 0} meetings to user ${userId}`);
    res.json({ meetings: list });
  } catch (e) {
    console.error('Error in listMine:', e);
    next(e);
  }
};

module.exports = {
  schedule,
  cancel,
  listMine,
};

