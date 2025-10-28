const { Op } = require('sequelize');
const { Availability, Connection, Meeting, User } = require('../models');
const { sendEmail } = require('./emailService');

async function areConnected(userId1, userId2) {
  const a = Math.min(userId1, userId2);
  const b = Math.max(userId1, userId2);
  const conn = await Connection.findOne({ where: { userA: a, userB: b } });
  return !!conn;
}

async function scheduleMeeting(requesterId, targetUserId, availabilityId, t) {
  if (!requesterId || !targetUserId || !availabilityId) {
    throw new Error('requesterId, targetUserId and availabilityId are required');
  }
  if (requesterId === targetUserId) throw new Error('Cannot schedule with yourself');

  const connected = await areConnected(requesterId, targetUserId);
  if (!connected) throw new Error('Users are not connected');

  // בלי wrap, פשוט להשתמש ב-t באופציות:
  const slot = await Availability.findByPk(availabilityId, { transaction: t });
  if (!slot) throw new Error('Availability not found');
  if (slot.userId !== targetUserId) throw new Error('Slot does not belong to target user');
  if (slot.isBooked) throw new Error('Slot already booked');
  if (new Date(slot.startTime) <= new Date()) throw new Error('Slot is in the past');

  const created = await Meeting.create({
      hostId: targetUserId,
      guestId: requesterId,
      availabilityId: slot.id,
      roomId: 'pending',
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: 'scheduled',
    },
    { transaction: t }
  );

  created.roomId = String(created.id);
  await created.save({ transaction: t });

  slot.isBooked = true;
  await slot.save({ transaction: t });

  console.log('Meeting created successfully:', {
    id: created.id,
    hostId: created.hostId,
    guestId: created.guestId,
    startTime: created.startTime,
    endTime: created.endTime,
    status: created.status
  });

  // Tip: Best to send emails after commit in controller (to avoid failures if rollback occurs)
  try {
    const host = await User.findByPk(targetUserId, { transaction: t });
    const guest = await User.findByPk(requesterId, { transaction: t });
    
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
    
    const meetingUrl = `${process.env.CLIENT_URL?.replace(/\/?$/, '')}/meeting/${created.id}`;
    const meetingDate = formatDateForEmail(slot.startTime);
    
    const emailHtml = (user, otherUser, isHost) => `
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
                      🎓 Lesson Scheduled
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #333; font-size: 18px; line-height: 1.6;">
                      Hello <strong>${user.firstName || 'User'}</strong>,
                    </p>
                    <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                      Your lesson with <strong style="color: #667eea;">${otherUser.firstName || 'User'}</strong> has been scheduled!
                    </p>
                    
                    <!-- Meeting Details Card -->
                    <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 30px 0;">
                      <div style="margin-bottom: 12px;">
                        <strong style="color: #333; font-size: 14px;">📅 Date & Time:</strong>
                        <p style="margin: 4px 0 0 0; color: #666; font-size: 16px;">${meetingDate}</p>
                      </div>
                      <div style="margin-top: 16px;">
                        <strong style="color: #333; font-size: 14px;">🆔 Meeting ID:</strong>
                        <p style="margin: 4px 0 0 0; color: #666; font-size: 16px;">${created.id}</p>
                      </div>
                    </div>
                    
                    <div style="margin-top: 40px; text-align: center;">
                      <a href="${meetingUrl}" 
                         style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                        Join the Lesson Room
                      </a>
                    </div>
                    
                    <p style="margin: 40px 0 0 0; color: #999; font-size: 14px; text-align: center; line-height: 1.6;">
                      We're excited to facilitate your learning journey together!
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
    
    if (host?.email) await sendEmail(host.email, 'Lesson Scheduled 🎓', emailHtml(host, guest, true));
    if (guest?.email) await sendEmail(guest.email, 'Lesson Scheduled 🎓', emailHtml(guest, host, false));
  } catch (e) {
    console.error('Failed to send meeting emails:', e.message);
  }

  return created;
}

async function cancelMeeting(meetingId, userId, t) {
  if (!meetingId || !userId) throw new Error('meetingId and userId are required');

  const mtg = await Meeting.findByPk(meetingId, { transaction: t });
  if (!mtg) throw new Error('Meeting not found');
  if (![mtg.hostId, mtg.guestId].includes(userId)) throw new Error('Not authorized');
  if (mtg.status === 'canceled') return mtg;

  mtg.status = 'canceled';
  await mtg.save({ transaction: t });

  if (mtg.availabilityId) {
    const slot = await Availability.findByPk(mtg.availabilityId, { transaction: t });
    if (slot) {
      slot.isBooked = false;
      await slot.save({ transaction: t });
    }
  }
  return mtg;
}

async function listMyMeetings(userId, { status = 'scheduled' } = {}) {
  if (!userId) throw new Error('userId is required');
  const where = {
    [Op.or]: [{ hostId: userId }, { guestId: userId }],
  };
  if (status) where.status = status;
  
  const meetings = await Meeting.findAll({ 
    where, 
    order: [['startTime', 'ASC']],
    include: [
      { 
        model: User, 
        as: 'host', 
        attributes: ['id', 'firstName', 'lastName', 'username'],
        required: false
      },
      { 
        model: User, 
        as: 'guest', 
        attributes: ['id', 'firstName', 'lastName', 'username'],
        required: false
      }
    ]
  });

  console.log(`Found ${meetings.length} meetings for user ${userId} with status ${status}`);
  return meetings;
}

module.exports = {
  scheduleMeeting,
  cancelMeeting,
  listMyMeetings,
};

