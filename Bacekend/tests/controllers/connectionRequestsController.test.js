jest.mock('../../services/contactRequestsService', () => ({
  getAll: jest.fn(),
  getAllForUser: jest.fn(),
  getAllSentForUser: jest.fn(),
  getAllReceivedForUser: jest.fn(),
  addContactRequest: jest.fn(),
  updateContactRequestStatus: jest.fn(),
  deleteContactRequest: jest.fn(),
}));

jest.mock('../../services/connectionsService', () => ({
  deleteConnection: jest.fn(),
}));

const contactRequestsService = require('../../services/contactRequestsService');
const controller = require('../../controllers/connectionRequestsController');

describe('connectionRequestsController.getReceivedRequestsForUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('responds with received requests for the authenticated user', async () => {
    const req = { session: { user: { id: 17 } } };
    const res = { json: jest.fn() };
    const next = jest.fn();
    const items = [{ id: 1 }, { id: 2 }];
    contactRequestsService.getAllReceivedForUser.mockResolvedValue(items);

    await controller.getReceivedRequestsForUser(req, res, next);

    expect(contactRequestsService.getAllReceivedForUser).toHaveBeenCalledWith(17);
    expect(res.json).toHaveBeenCalledWith({ data: items });
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards errors to the error handler', async () => {
    const req = { session: { user: { id: 44 } } };
    const res = { json: jest.fn() };
    const next = jest.fn();
    contactRequestsService.getAllReceivedForUser.mockRejectedValue(new Error('boom'));

    await controller.getReceivedRequestsForUser(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      status: 404,
      message: expect.stringContaining('Error ->'),
    }));
  });
});
