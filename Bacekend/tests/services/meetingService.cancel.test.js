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

const { Availability, Meeting } = require('../../models');
const meetingService = require('../../services/meetingService');

describe('meetingService.cancelMeeting', () => {
  const transaction = { id: 'tx-2' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cancels the meeting and releases the slot when requester is a participant', async () => {
    const meeting = {
      id: 88,
      hostId: 2,
      guestId: 1,
      availabilityId: 33,
      status: 'scheduled',
      save: jest.fn().mockResolvedValue(),
    };
    Meeting.findByPk.mockResolvedValue(meeting);

    const slot = {
      id: 33,
      isBooked: true,
      save: jest.fn().mockResolvedValue(),
    };
    Availability.findByPk.mockResolvedValue(slot);

    const result = await meetingService.cancelMeeting(meeting.id, 1, transaction);

    expect(Meeting.findByPk).toHaveBeenCalledWith(meeting.id, { transaction });
    expect(meeting.status).toBe('canceled');
    expect(meeting.save).toHaveBeenCalledWith({ transaction });
    expect(slot.isBooked).toBe(false);
    expect(slot.save).toHaveBeenCalledWith({ transaction });
    expect(result).toBe(meeting);
  });

  it('throws when user is not a meeting participant', async () => {
    const meeting = {
      id: 88,
      hostId: 2,
      guestId: 3,
      status: 'scheduled',
    };
    Meeting.findByPk.mockResolvedValue(meeting);

    await expect(
      meetingService.cancelMeeting(meeting.id, 1, transaction),
    ).rejects.toThrow('Not authorized');
    expect(meeting.status).toBe('scheduled');
  });
});
