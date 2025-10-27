const { Op } = require('sequelize');
const { Meeting } = require('../models');

const isMeetingParticipant = async (req, res, next) =>{
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const meetingId = req.params.meetingId || req.params.id;
    if (!meetingId) {
      return res.status(400).json({ error: 'meetingId is required' });
    }

    // אם ה־IDs מספריים:
    const meetingIdNum = Number(meetingId);
    if (Number.isNaN(meetingIdNum)) {
      return res.status(400).json({ error: 'Invalid meetingId' });
    }

    const meeting = await Meeting.findOne({
        where:{
            id: meetingIdNum, 
            status:'scheduled',
            // startTime: { [Op.lte]: new Date(Date.now() + 5 * 60 * 1000) },
            // endTime: { [Op.gt]: new Date() }
        }
    });

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const uid = Number(userId);
    const allowed = meeting.hostId === uid || meeting.guestId === uid;

    if (!allowed) {
      return res.status(403).json({ error: 'Forbidden' });
    }


    req.meeting = meeting;
    next();
  } catch (err) {
    console.error('[isMeetingParticipant] error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
    isMeetingParticipant
}