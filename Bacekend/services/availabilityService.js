const { Op } = require('sequelize');
const { Availability, MeetingAlert, User } = require('../models');
const { sendEmail } = require('./emailService');

const normalizeSlots = (slots) => {
  if (!Array.isArray(slots)) return [];
  return slots
    .map((s) => ({
      startTime: new Date(s.startTime || s.start || s.from),
      endTime: new Date(s.endTime || s.end || s.to),
    }))
    .filter((s) => s.startTime instanceof Date && !isNaN(s.startTime) && s.endTime instanceof Date && !isNaN(s.endTime) && s.endTime > s.startTime);
};

async function addSlots(userId, rawSlots) {
  if (!userId) throw new Error('userId is required');
  const slots = normalizeSlots(rawSlots);
  if (!slots.length) throw new Error('No valid slots provided');

  // Ensure no overlaps with existing availabilities
  const startMin = new Date(Math.min(...slots.map((s) => s.startTime.getTime())));
  const endMax = new Date(Math.max(...slots.map((s) => s.endTime.getTime())));

  destroyExpireAvailability(userId)

  const existing = await Availability.findAll({
    where: {
      userId,
      [Op.or]: [
        { startTime: { [Op.between]: [startMin, endMax] } },
        { endTime: { [Op.between]: [startMin, endMax] } },
        {
          [Op.and]: [
            { startTime: { [Op.lte]: startMin } },
            { endTime: { [Op.gte]: endMax } },
          ],
        },
      ],
    },
  });

  if (existing.length) {
    // simple policy: do not allow overlapping creation in this batch
    throw new Error('Overlapping with existing availabilities');
  }

  const created = await Availability.bulkCreate(
    slots.map((s) => ({ userId, startTime: s.startTime, endTime: s.endTime })),
    { returning: true }
  );

  // Notify watchers (alerts)
  try {
    const alerts = await MeetingAlert.findAll({ where: { targetUserId: userId, active: true } });
    if (alerts.length) {
      const owner = await User.findByPk(userId);
      for (const alert of alerts) {
        const watcher = await User.findByPk(alert.watcherId);
        if (!watcher?.email) continue;
        const list = created
          .map((c) => `• ${c.startTime.toISOString()} - ${c.endTime.toISOString()}`)
          .join('<br/>');
        const html = `
          <p>שלום ${watcher.firstName || ''},</p>
          <p>${owner?.firstName || 'משתמש'} הוסיף זמני פניות חדשים:</p>
          <p>${list}</p>
          <p>היכנס/י לאתר כדי לקבוע שיעור.</p>
        `;
        await sendEmail(watcher.email, 'התראה: נוספו זמני פניות', html);
      }
    }
  } catch (e) {
    console.error('Failed to send availability alerts:', e.message);
  }

  return created;
}

async function listUserAvailability(targetUserId, { start, end } = {}) {
  if (!targetUserId) throw new Error('targetUserId is required');

  const now = new Date();
  const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
  
  destroyExpireAvailability(targetUserId);

  const where = {
    userId: targetUserId,
    isBooked: false,
    startTime: { [Op.gte]: twoMinutesAgo }, 
  };

  if (end) where.startTime[Op.lte] = new Date(end);
  if (start) where.startTime[Op.gte] = new Date(start);

  return Availability.findAll({
    where,
    order: [['startTime', 'ASC']],
  });
}

const destroyExpireAvailability = async(userId) =>{
  const now = new Date();
  const threeMinutesAgo = new Date(now.getTime() - 3 * 60 * 1000);

  await Availability.destroy({
    where:{
      userId,
      isBooked:false,
      startTime:{[Op.lt]: threeMinutesAgo}
    }
  })
}

async function removeSlot(userId, availabilityId) {
  if (!userId || !availabilityId) throw new Error('userId and availabilityId are required');
  const slot = await Availability.findByPk(availabilityId);
  if (!slot || slot.userId !== userId) throw new Error('Not found');
  if (slot.isBooked) throw new Error('Cannot delete a booked slot');
  await slot.destroy();
  return { success: true };
}

async function subscribeAlert(watcherId, targetUserId) {
  if (!watcherId || !targetUserId) throw new Error('watcherId and targetUserId are required');
  if (watcherId === targetUserId) throw new Error('Cannot subscribe to yourself');
  const [rec] = await MeetingAlert.findOrCreate({
    where: { watcherId, targetUserId },
    defaults: { active: true },
  });
  if (!rec.active) {
    rec.active = true;
    await rec.save();
  }
  return rec;
}

module.exports = {
  addSlots,
  listUserAvailability,
  removeSlot,
  subscribeAlert,
};

