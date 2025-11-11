import { screen, waitFor, fireEvent } from '@testing-library/react';
import NotificationsPreview from './NotificationsPreview';
import notificationsAPI from '../../services/notificationsAPI';
import { renderWithProviders, buildAuthState } from '../../test/testUtils';
import { useNotifications } from '../../contexts/NotificationsContext';

jest.mock('../../services/notificationsAPI');
jest.mock('../../contexts/NotificationsContext', () => ({
  useNotifications: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('NotificationsPreview', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    notificationsAPI.getAll.mockReset();
    useNotifications.mockReset();
  });

  it('shows the empty state when there are no unread notifications', async () => {
    notificationsAPI.getAll.mockResolvedValue({ data: [] });
    useNotifications.mockReturnValue({
      unreadCount: 0,
      refreshUnreadCount: jest.fn(),
    });

    renderWithProviders(<NotificationsPreview />, {
      preloadedState: buildAuthState({ id: 55 }),
    });

    await waitFor(() => expect(notificationsAPI.getAll).toHaveBeenCalled());

    expect(await screen.findByText('No unread notifications')).toBeInTheDocument();
    expect(screen.getByText("You're all caught up!")).toBeInTheDocument();
  });

  it('renders unread notifications with quick navigation affordances', async () => {
    const now = Date.now();
    notificationsAPI.getAll.mockResolvedValue({
      data: [
        {
          id: 1,
          title: 'Lesson starting soon',
          message: 'Your meeting with Dana starts in 10 minutes',
          createdAt: new Date(now - 10 * 60000).toISOString(),
          type: 'info',
          link: '/meeting/1',
        },
        {
          id: 2,
          title: 'Connection approved',
          message: 'Alex approved your request',
          createdAt: new Date(now - 2 * 3600000).toISOString(),
          type: 'success',
        },
      ],
    });
    useNotifications.mockReturnValue({
      unreadCount: 2,
      refreshUnreadCount: jest.fn(),
    });

    renderWithProviders(<NotificationsPreview />, {
      preloadedState: buildAuthState({ id: 55 }),
    });

    await waitFor(() => expect(notificationsAPI.getAll).toHaveBeenCalled());

    const lessonTitle = await screen.findByText('Lesson starting soon');
    expect(screen.getByText('2')).toBeInTheDocument(); // badge
    expect(screen.getByText('Connection approved')).toBeInTheDocument();
    expect(screen.getByText('10m ago')).toBeInTheDocument();

    fireEvent.click(lessonTitle.parentElement.parentElement);
    expect(mockNavigate).toHaveBeenCalledWith('/meeting/1');

    fireEvent.click(screen.getByRole('button', { name: /View All/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/notifications');
  });
});
