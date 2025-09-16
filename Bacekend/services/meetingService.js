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

  // טיפ: עדיף לשלוח מיילים אחרי commit בקונטרולר (כדי לא להיכשל אם יתגלגל אחורה)
  try {
    const host = await User.findByPk(targetUserId, { transaction: t });
    const guest = await User.findByPk(requesterId, { transaction: t });
    const when = new Date(slot.startTime).toLocaleString();
    const detailsHtml = (u) => `
      <p>שלום ${u.firstName || ''},</p>
      <p>נקבע שיעור בתאריך ${when}.</p>
      <p>קישור לחדר: ${process.env.CLIENT_URL?.replace(/\/?$/, '')}/meeting/${created.id}</p>
      <p>מספר פגישה: ${created.id}</p>
    `;
    if (host?.email) await sendEmail(host.email, 'שיעור נקבע', detailsHtml(host));
    if (guest?.email) await sendEmail(guest.email, 'שיעור נקבע', detailsHtml(guest));
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
  return Meeting.findAll({ where, order: [['startTime', 'ASC']] });
}

module.exports = {
  scheduleMeeting,
  cancelMeeting,
  listMyMeetings,
};

