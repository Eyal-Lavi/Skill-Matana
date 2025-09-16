const { Op } = require('sequelize');
const { Meeting, User } = require('../models');
const { sendEmail } = require('./emailService');

async function sendDailyReminders() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const meetings = await Meeting.findAll({
    where: {
      status: 'scheduled',
      reminderSent: false,
      startTime: { [Op.gte]: startOfDay, [Op.lt]: endOfDay },
    },
  });

  for (const m of meetings) {
    try {
      const host = await User.findByPk(m.hostId);
      const guest = await User.findByPk(m.guestId);
      const when = new Date(m.startTime).toLocaleString();
      const html = (u) => `
        <p>שלום ${u.firstName || ''},</p>
        <p>תזכורת: היום יש לך שיעור בשעה ${when}.</p>
        <p>קישור לחדר: ${process.env.CLIENT_URL?.replace(/\/?$/, '')}/meeting/${m.id}</p>
      `;
      if (host?.email) await sendEmail(host.email, 'תזכורת לשיעור היום', html(host));
      if (guest?.email) await sendEmail(guest.email, 'תזכורת לשיעור היום', html(guest));
      m.reminderSent = true;
      await m.save();
    } catch (e) {
      console.error('Failed to send reminder for meeting', m.id, e.message);
    }
  }
}

function startReminderScheduler() {
  // Run every hour
  setInterval(() => {
    sendDailyReminders().catch((e) => console.error('Reminder job failed:', e.message));
  }, 60 * 60 * 1000);

  // Also run shortly after boot
  setTimeout(() => {
    sendDailyReminders().catch((e) => console.error('Reminder job failed (initial):', e.message));
  }, 30 * 1000);
}

module.exports = {
  startReminderScheduler,
  sendDailyReminders,
};

