const request = require('supertest');
const express = require('express');

jest.mock('../../middlewares/authMiddleware', () => ({
  isLoggedIn: (req, res, next) => {
    req.session = req.session || {};
    req.session.isLoggedIn = true;
    req.session.user = req.session.user || { id: 123 };
    next();
  },
  isAdmin: (req, res, next) => next(),
}));

jest.mock('../../middlewares/meetingMiddleware', () => ({
  isMeetingParticipant: (req, res, next) => {
    req.meeting = { roomId: 'room-1' };
    next();
  },
}));

jest.mock('../../services/meetingService', () => ({
  scheduleMeeting: jest.fn(),
  cancelMeeting: jest.fn(),
  listMyMeetings: jest.fn(),
}));

const meetingsRouter = require('../../routes/meetings');
const meetingService = require('../../services/meetingService');

describe('GET /meetings/my (dashboard upcoming meetings feed)', () => {
  it('returns the meetings provided by the service for the authenticated user', async () => {
    const meetings = [
      { id: 1, startTime: '2025-01-01T10:00:00Z' },
      { id: 2, startTime: '2025-01-02T10:00:00Z' },
    ];
    meetingService.listMyMeetings.mockResolvedValue(meetings);

    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.session = { isLoggedIn: true, user: { id: 321 } };
      next();
    });
    app.use('/meetings', meetingsRouter);

    const response = await request(app).get('/meetings/my?status=scheduled');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ meetings });
    expect(meetingService.listMyMeetings).toHaveBeenCalledWith(321, { status: 'scheduled' });
  });
});
