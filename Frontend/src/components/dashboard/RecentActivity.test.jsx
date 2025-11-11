import { screen, waitFor, fireEvent } from '@testing-library/react';
import RecentActivity from './RecentActivity';
import meetingsAPI from '../../services/meetingsAPI';
import { renderWithProviders, buildAuthState } from '../../test/testUtils';

jest.mock('../../services/meetingsAPI');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RecentActivity', () => {
  beforeEach(() => {
    meetingsAPI.getMyMeetings.mockReset();
    mockNavigate.mockClear();
  });

  it('shows only meetings that are in-progress and navigates into the room', async () => {
    const now = Date.now();
    meetingsAPI.getMyMeetings.mockResolvedValue({
      meetings: [
        {
          id: 1,
          startTime: new Date(now - 15 * 60000).toISOString(),
          endTime: new Date(now + 15 * 60000).toISOString(),
          host: { id: 99, firstName: 'Alex', lastName: 'Teacher' },
          guest: { id: 10, firstName: 'Current', lastName: 'User' },
        },
        {
          id: 2,
          startTime: new Date(now + 60 * 60000).toISOString(),
          endTime: new Date(now + 120 * 60000).toISOString(),
          host: { id: 10, firstName: 'Current', lastName: 'User' },
          guest: { id: 77, firstName: 'Jamie', lastName: 'Friend' },
        },
        {
          id: 3,
          startTime: new Date(now - 180 * 60000).toISOString(),
          endTime: new Date(now - 60 * 60000).toISOString(),
          host: { id: 55, firstName: 'Dana', lastName: 'Past' },
          guest: { id: 10, firstName: 'Current', lastName: 'User' },
        },
      ],
    });

    renderWithProviders(<RecentActivity />, {
      preloadedState: buildAuthState({ id: 10 }),
    });

    await waitFor(() => expect(meetingsAPI.getMyMeetings).toHaveBeenCalled());

    const activeDescription = await screen.findByText(/with Alex Teacher/);
    expect(screen.queryByText(/with Jamie Friend/)).not.toBeInTheDocument();
    expect(screen.queryByText(/with Dana Past/)).not.toBeInTheDocument();

    const clickableCard = activeDescription.parentElement.parentElement.parentElement;
    fireEvent.click(clickableCard);

    expect(mockNavigate).toHaveBeenCalledWith('/meeting/1');
  });
});
