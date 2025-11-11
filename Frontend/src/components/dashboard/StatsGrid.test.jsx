import { screen, waitFor, within, fireEvent } from '@testing-library/react';
import StatsGrid from './StatsGrid';
import meetingsAPI from '../../services/meetingsAPI';
import { renderWithProviders, buildAuthState } from '../../test/testUtils';
import { useNotifications } from '../../contexts/NotificationsContext';

jest.mock('../../services/meetingsAPI');
jest.mock('../../contexts/NotificationsContext', () => ({
  useNotifications: jest.fn(),
}));
jest.mock('../../config/env', () => ({
  API_BASE_URL: 'http://localhost:4000',
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('StatsGrid (dashboard KPIs)', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    meetingsAPI.getMyMeetings.mockReset();
    global.fetch.mockReset();
    useNotifications.mockReturnValue({
      unreadCount: 4,
      refreshUnreadCount: jest.fn(),
    });
  });

  it('loads dashboard stats and surfaces the computed counts with navigation handlers', async () => {
    const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const future2 = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    meetingsAPI.getMyMeetings.mockResolvedValue({
      meetings: [
        { id: 1, startTime: future },
        { id: 2, startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
      ],
    });

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [{ status: 'pending' }, { status: 'accepted' }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [{ status: 'pending' }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          availability: [
            { id: 1, startTime: future, isBooked: false },
            { id: 2, startTime: future2, isBooked: false },
            { id: 3, startTime: future, isBooked: true },
          ],
        }),
      });

    renderWithProviders(<StatsGrid />, {
      preloadedState: buildAuthState({
        id: 44,
        firstName: 'Dana',
        skills: [{ id: 1 }, { id: 2 }, { id: 3 }],
        connections: [{ id: 1 }, { id: 2 }],
      }),
    });

    await waitFor(() => expect(meetingsAPI.getMyMeetings).toHaveBeenCalled());

    expect(within(screen.getByText('My Skills').parentElement).getByText('3')).toBeInTheDocument();
    expect(within(screen.getByText('Connections').parentElement).getByText('2')).toBeInTheDocument();

    await waitFor(() =>
      expect(within(screen.getByText('Upcoming Meetings').parentElement).getByText('1')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(within(screen.getByText('Pending Requests').parentElement).getByText('2')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(within(screen.getByText('Availability Slots').parentElement).getByText('2')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(within(screen.getByText('Notifications').parentElement).getByText('4')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText('Connections').closest('div'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/contact-requests');
  });
});
