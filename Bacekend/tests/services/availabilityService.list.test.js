jest.mock('../../models', () => ({
  Availability: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    bulkCreate: jest.fn(),
  },
  RecurringAvailability: {
    findAll: jest.fn(),
  },
  MeetingAlert: {
    findAll: jest.fn(),
    findOrCreate: jest.fn(),
    findOne: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
}));

const { Availability } = require('../../models');
const availabilityService = require('../../services/availabilityService');

describe('availabilityService.listUserAvailability', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns ordered, unbooked future slots for the requested user', async () => {
    const fakeSlots = [{ id: 1 }, { id: 2 }];
    Availability.findAll.mockResolvedValue(fakeSlots);

    const result = await availabilityService.listUserAvailability(42);

    expect(Availability.findAll).toHaveBeenCalledWith({
      where: expect.objectContaining({
        userId: 42,
        isBooked: false,
      }),
      order: [['startTime', 'ASC']],
    });
    expect(result).toBe(fakeSlots);
  });

  it('throws when targetUserId is missing', async () => {
    await expect(availabilityService.listUserAvailability()).rejects.toThrow(
      'targetUserId is required',
    );
    expect(Availability.findAll).not.toHaveBeenCalled();
  });
});
