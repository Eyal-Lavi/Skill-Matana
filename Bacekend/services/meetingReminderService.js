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
      
      const formatDateForEmail = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      };
      
      const meetingUrl = `${process.env.CLIENT_URL?.replace(/\/?$/, '')}/meeting/${m.id}`;
      const meetingTime = formatDateForEmail(m.startTime);
      
      const emailHtml = (user, otherUser) => `
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
                        ⏰ Meeting Reminder
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px 0; color: #333; font-size: 18px; line-height: 1.6;">
                        Hello <strong>${user.firstName || 'User'}</strong>,
                      </p>
                      <p style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.6;">
                        This is a friendly reminder that you have a lesson today!
                      </p>
                      
                      <!-- Meeting Details Card -->
                      <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 30px 0;">
                        <div style="margin-bottom: 12px;">
                          <strong style="color: #333; font-size: 14px;">👥 With:</strong>
                          <p style="margin: 4px 0 0 0; color: #666; font-size: 16px;">${otherUser.firstName || 'User'}</p>
                        </div>
                        <div style="margin-top: 16px;">
                          <strong style="color: #333; font-size: 14px;">⏰ Time:</strong>
                          <p style="margin: 4px 0 0 0; color: #666; font-size: 16px;">${meetingTime}</p>
                        </div>
                        <div style="margin-top: 16px;">
                          <strong style="color: #333; font-size: 14px;">🆔 Meeting ID:</strong>
                          <p style="margin: 4px 0 0 0; color: #666; font-size: 16px;">${m.id}</p>
                        </div>
                      </div>
                      
                      <div style="margin-top: 40px; text-align: center;">
                        <a href="${meetingUrl}" 
                           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                          Join the Lesson Room
                        </a>
                      </div>
                      
                      <p style="margin: 40px 0 0 0; color: #999; font-size: 14px; text-align: center; line-height: 1.6;">
                        See you soon! We're excited for your learning session.
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
      
      if (host?.email) await sendEmail(host.email, 'Meeting Reminder ⏰', emailHtml(host, guest));
      if (guest?.email) await sendEmail(guest.email, 'Meeting Reminder ⏰', emailHtml(guest, host));
      m.reminderSent = true;
      await m.save();
    } catch (e) {
      console.error('Failed to send reminder for meeting', m.id, e.message);
    }
  }
}

function startReminderScheduler() {

  setInterval(() => {
    sendDailyReminders().catch((e) => console.error('Reminder job failed:', e.message));
  }, 60 * 60 * 1000);


  setTimeout(() => {
    sendDailyReminders().catch((e) => console.error('Reminder job failed (initial):', e.message));
  }, 30 * 1000);
}

module.exports = {
  startReminderScheduler,
  sendDailyReminders,
};

