const { Op } = require('sequelize');
const { Availability, RecurringAvailability, MeetingAlert, User } = require('../models');
const { sendEmail } = require('./emailService');
const { createNotificationForUser } = require('./notificationsService');

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
      const ownerName = owner?.firstName || owner?.username || 'A user';
      const slotCount = created.length;
      const inAppTitle = 'New availability slots';
      const inAppMessage = `${ownerName} added ${slotCount} new available time slot${slotCount === 1 ? '' : 's'}.`;
      const inAppLink = '/dashboard/contact-requests';

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

      // Create in-app notifications (independent of email availability)
      await Promise.allSettled(
        alerts.map((alert) =>
          createNotificationForUser(alert.watcherId, 'info', inAppTitle, inAppMessage, inAppLink)
        )
      );
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

async function unsubscribeAlert(watcherId, targetUserId) {
  if (!watcherId || !targetUserId) throw new Error('watcherId and targetUserId are required');
  const alert = await MeetingAlert.findOne({
    where: { watcherId, targetUserId },
  });
  if (!alert) throw new Error('Alert subscription not found');
  alert.active = false;
  await alert.save();
  return { success: true, message: 'Unsubscribed successfully' };
}

async function getAlertStatus(watcherId, targetUserId) {
  if (!watcherId || !targetUserId) return { subscribed: false, active: false };
  const alert = await MeetingAlert.findOne({
    where: { watcherId, targetUserId },
  });
  return {
    subscribed: !!alert,
    active: alert?.active || false,
  };
}

async function getMySubscriptions(watcherId) {
  if (!watcherId) throw new Error('watcherId is required');
  const alerts = await MeetingAlert.findAll({
    where: { watcherId },
    include: [
      {
        model: User,
        as: 'targetUser',
        attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
  return alerts.map(alert => ({
    id: alert.id,
    targetUserId: alert.targetUserId,
    active: alert.active,
    createdAt: alert.createdAt,
    updatedAt: alert.updatedAt,
    targetUser: alert.targetUser,
  }));
}

async function addRecurringAvailability(userId, recurringData) {
  if (!userId) throw new Error('userId is required');
  const { dayOfWeek, startTime, endTime } = recurringData;
  
  if (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6) {
    throw new Error('dayOfWeek must be between 0 (Sunday) and 6 (Saturday)');
  }
  if (!startTime || !endTime) {
    throw new Error('startTime and endTime are required');
  }

  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  if (end <= start) {
    throw new Error('endTime must be after startTime');
  }

  const [recurring, created] = await RecurringAvailability.findOrCreate({
    where: { userId, dayOfWeek, startTime, endTime },
    defaults: { isActive: true },
  });

  if (!created && !recurring.isActive) {
    recurring.isActive = true;
    await recurring.save();
  }

  return recurring;
}

async function getMyRecurringAvailability(userId) {
  if (!userId) throw new Error('userId is required');
  return await RecurringAvailability.findAll({
    where: { userId },
    order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']],
  });
}

async function updateRecurringAvailability(userId, recurringId, updates) {
  if (!userId || !recurringId) throw new Error('userId and recurringId are required');
  
  const recurring = await RecurringAvailability.findOne({
    where: { id: recurringId, userId },
  });
  
  if (!recurring) throw new Error('Recurring availability not found');

  if (updates.startTime && updates.endTime) {
    const start = new Date(`2000-01-01T${updates.startTime}`);
    const end = new Date(`2000-01-01T${updates.endTime}`);
    if (end <= start) {
      throw new Error('endTime must be after startTime');
    }
  }

  Object.assign(recurring, updates);
  await recurring.save();
  return recurring;
}

async function deleteRecurringAvailability(userId, recurringId) {
  if (!userId || !recurringId) throw new Error('userId and recurringId are required');
  
  const recurring = await RecurringAvailability.findOne({
    where: { id: recurringId, userId },
  });
  
  if (!recurring) throw new Error('Recurring availability not found');
  
  await recurring.destroy();
  return { success: true };
}

async function generateSlotsFromRecurring(userId, weeksAhead = 4) {
  if (!userId) throw new Error('userId is required');
  
  const recurring = await RecurringAvailability.findAll({
    where: { userId, isActive: true },
  });

  if (!recurring.length) return [];

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + (weeksAhead * 7));

  const slots = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (const rec of recurring) {
    const currentDate = new Date(now);
    currentDate.setHours(0, 0, 0, 0);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      
      if (dayOfWeek === rec.dayOfWeek) {
        const [startHours, startMinutes] = rec.startTime.split(':').map(Number);
        const [endHours, endMinutes] = rec.endTime.split(':').map(Number);
        
        const slotStart = new Date(currentDate);
        slotStart.setHours(startHours, startMinutes, 0, 0);
        
        const slotEnd = new Date(currentDate);
        slotEnd.setHours(endHours, endMinutes, 0, 0);

        if (slotStart > now && slotEnd > slotStart) {
          slots.push({
            startTime: slotStart,
            endTime: slotEnd,
          });
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  if (!slots.length) return [];

  const startMin = new Date(Math.min(...slots.map(s => s.startTime.getTime())));
  const endMax = new Date(Math.max(...slots.map(s => s.endTime.getTime())));

  const existing = await Availability.findAll({
    where: {
      userId,
      [Op.or]: [
        { startTime: { [Op.between]: [startMin, endMax] } },
        { endTime: { [Op.between]: [startMin, endMax] } },
      ],
    },
  });

  const existingSet = new Set(
    existing.map(e => `${e.startTime.toISOString()}_${e.endTime.toISOString()}`)
  );

  const newSlots = slots.filter(s => {
    const key = `${s.startTime.toISOString()}_${s.endTime.toISOString()}`;
    return !existingSet.has(key);
  });

  if (!newSlots.length) return [];

  const created = await Availability.bulkCreate(
    newSlots.map(s => ({ userId, startTime: s.startTime, endTime: s.endTime })),
    { returning: true }
  );

  try {
    const alerts = await MeetingAlert.findAll({ where: { targetUserId: userId, active: true } });
    if (alerts.length && created.length) {
      const owner = await User.findByPk(userId);
      const ownerName = owner?.firstName || owner?.username || 'A user';
      const slotCount = created.length;
      const inAppTitle = 'New availability slots';
      const inAppMessage = `${ownerName} added ${slotCount} new available time slot${slotCount === 1 ? '' : 's'}.`;
      const inAppLink = '/dashboard/contact-requests';

      for (const alert of alerts) {
        const watcher = await User.findByPk(alert.watcherId);
        if (!watcher?.email) continue;
        
        const formatDateForEmail = (date) => {
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        };
        
        const timeSlots = created
          .slice(0, 10)
          .map((c) => `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 16px; margin-bottom: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="color: white; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">📅</span>
                <span>${formatDateForEmail(c.startTime)} → ${formatDateForEmail(c.endTime)}</span>
              </div>
            </div>
          `)
          .join('');
        
        const slotCount = created.length > 10 ? ` and ${created.length - 10} more` : '';
        
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
                          <strong style="color: #667eea;">${owner?.firstName || 'User'}</strong> has added ${created.length} new available time slot${created.length > 1 ? 's' : ''}${slotCount}:
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

      // Create in-app notifications (independent of email availability)
      await Promise.allSettled(
        alerts.map((alert) =>
          createNotificationForUser(alert.watcherId, 'info', inAppTitle, inAppMessage, inAppLink)
        )
      );
    }
  } catch (e) {
    console.error('Failed to send availability alerts:', e.message);
  }

  return created;
}

module.exports = {
  addSlots,
  listUserAvailability,
  removeSlot,
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

