jest.mock('../../models', () => ({
  Availability: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    bulkCreate: jest.fn(),
  },
  Connection: {
    findOne: jest.fn(),
  },
  Meeting: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
}));

jest.mock('../../services/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(),
}));

const { Availability, Connection, Meeting, User } = require('../../models');
const { sendEmail } = require('../../services/emailService');
const meetingService = require('../../services/meetingService');

describe('meetingService.scheduleMeeting', () => {
  const transaction = { id: 'tx-1' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a meeting, reserves the slot and notifies both parties', async () => {
    const requesterId = 1;
    const targetUserId = 2;
    const availabilityId = 55;

    Connection.findOne.mockResolvedValue({ id: 999 });

    const slot = {
      id: availabilityId,
      userId: targetUserId,
      isBooked: false,
      startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      save: jest.fn().mockResolvedValue(),
    };
    Availability.findByPk.mockResolvedValue(slot);

    const meeting = {
      id: 777,
      hostId: targetUserId,
      guestId: requesterId,
      roomId: 'pending',
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: 'scheduled',
      save: jest.fn().mockResolvedValue(),
    };
    Meeting.create.mockResolvedValue(meeting);

    User.findByPk
      .mockResolvedValueOnce({ id: targetUserId, email: 'host@test.dev', firstName: 'Host' })
      .mockResolvedValueOnce({ id: requesterId, email: 'guest@test.dev', firstName: 'Guest' });

    const result = await meetingService.scheduleMeeting(
      requesterId,
      targetUserId,
      availabilityId,
      transaction,
    );

    expect(Connection.findOne).toHaveBeenCalledWith({
      where: { userA: requesterId, userB: targetUserId },
    });
    expect(Availability.findByPk).toHaveBeenCalledWith(availabilityId, { transaction });
    expect(Meeting.create).toHaveBeenCalledWith(
      expect.objectContaining({
        hostId: targetUserId,
        guestId: requesterId,
        availabilityId,
        status: 'scheduled',
      }),
      { transaction },
    );
    expect(meeting.save).toHaveBeenCalledWith({ transaction });
    expect(slot.isBooked).toBe(true);
    expect(slot.save).toHaveBeenCalledWith({ transaction });
    expect(sendEmail).toHaveBeenCalledTimes(2);
    expect(result.roomId).toBe(String(meeting.id));
  });

  it('throws when users are not connected', async () => {
    Connection.findOne.mockResolvedValue(null);

    await expect(
      meetingService.scheduleMeeting(1, 2, 10, transaction),
    ).rejects.toThrow('Users are not connected');
    expect(Availability.findByPk).not.toHaveBeenCalled();
    expect(Meeting.create).not.toHaveBeenCalled();
  });
});
