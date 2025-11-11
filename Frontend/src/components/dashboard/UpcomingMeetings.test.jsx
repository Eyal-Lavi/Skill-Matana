import { screen, waitFor, fireEvent } from '@testing-library/react';
import UpcomingMeetings from './UpcomingMeetings';
import meetingsAPI from '../../services/meetingsAPI';
import { renderWithProviders, buildAuthState } from '../../test/testUtils';

jest.mock('../../services/meetingsAPI');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('UpcomingMeetings', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    meetingsAPI.getMyMeetings.mockReset();
  });

  it('shows the next five future meetings in chronological order and wires navigation', async () => {
    const now = Date.now();
    const makeMeeting = (minutesAhead, idSuffix) => ({
      id: idSuffix,
      startTime: new Date(now + minutesAhead * 60000).toISOString(),
      host: { id: idSuffix % 2 === 0 ? 10 : 77, firstName: `Host${idSuffix}`, lastName: `Last${idSuffix}` },
      guest: { id: idSuffix % 2 === 0 ? 77 : 10, firstName: `Guest${idSuffix}`, lastName: `Friend${idSuffix}` },
    });

    meetingsAPI.getMyMeetings.mockResolvedValue({
      meetings: [
        makeMeeting(180, 3),
        makeMeeting(-60, 4), // should be filtered out
        makeMeeting(90, 5),
        makeMeeting(30, 6),
        makeMeeting(240, 7),
        makeMeeting(15, 8),
        makeMeeting(10, 9),
      ],
    });

    renderWithProviders(<UpcomingMeetings />, {
      preloadedState: buildAuthState({ id: 10 }),
    });

    await waitFor(() => expect(meetingsAPI.getMyMeetings).toHaveBeenCalled());

    const meetingNames = await screen.findAllByRole('heading', { level: 3 });
    const renderedOrder = meetingNames.map((node) => node.textContent);
    expect(renderedOrder).toEqual([
      'Host9 Last9',
      'Guest8 Friend8',
      'Guest6 Friend6',
      'Host5 Last5',
      'Host3 Last3',
    ]);

    fireEvent.click(screen.getByRole('button', { name: /View All/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/notifications');

    const firstCard = meetingNames[0].parentElement.parentElement;
    fireEvent.click(firstCard);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/notifications');
  });
});
