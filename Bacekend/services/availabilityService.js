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


  const startMin = new Date(Math.min(...slots.map((s) => s.startTime.getTime())));
  const endMax = new Date(Math.max(...slots.map((s) => s.endTime.getTime())));


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
  
    throw new Error('Overlapping with existing availabilities');
  }

  const created = await Availability.bulkCreate(
    slots.map((s) => ({ userId, startTime: s.startTime, endTime: s.endTime })),
    { returning: true }
  );


  const formatDateForEmail = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  try {
    const alerts = await MeetingAlert.findAll({ where: { targetUserId: userId, active: true } });
    if (alerts.length) {
      const owner = await User.findByPk(userId);
      for (const alert of alerts) {
        const watcher = await User.findByPk(alert.watcherId);
        if (!watcher?.email) continue;
        
        const timeSlots = created
          .map((c) => `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 16px; margin-bottom: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="color: white; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">📅</span>
                <span>${formatDateForEmail(c.startTime)} → ${formatDateForEmail(c.endTime)}</span>
              </div>
            </div>
          `)
          .join('');
        
        const html = `
          <!DOCTYPE html>
          <html dir="ltr" lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">
                          🎓 New Available Time Slots
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px 0; color: #333; font-size: 18px; line-height: 1.6;">
                          Hello <strong>${watcher.firstName || 'User'}</strong>,
                        </p>
                        <p style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.6;">
                          <strong style="color: #667eea;">${owner?.firstName || 'User'}</strong> has added new available time slots for lessons:
                        </p>
                        
                        ${timeSlots}
                        
                        <div style="margin-top: 40px; text-align: center;">
                          <a href="http://localhost:5173/dashboard" 
                             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s;">
                            Go to Schedule a Lesson
                          </a>
                        </div>
                        
                        <p style="margin: 40px 0 0 0; color: #999; font-size: 14px; text-align: center; line-height: 1.6;">
                          We're committed to the best experience to ensure your lesson happens on time
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0; color: #999; font-size: 13px;">
                          © Skill Matana - Collaborative Learning Platform
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;
        
        await sendEmail(watcher.email, 'Alert: New Available Time Slots 🎓', html);
      }
    }
  } catch (e) {
    console.error('Failed to send availability alerts:', e.message);
  }

  return created;
}

async function listUserAvailability(targetUserId, { start, end } = {}) {
  if (!targetUserId) throw new Error('targetUserId is required');
  
  const where = {
    userId: targetUserId,
    isBooked: false,
    endTime: { [Op.gt]: new Date()}, 
  };

  if (end) where.startTime[Op.lte] = new Date(end);
  if (start) where.startTime[Op.gte] = new Date(start);

  return Availability.findAll({
    where,
    order: [['startTime', 'ASC']],
  });
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

