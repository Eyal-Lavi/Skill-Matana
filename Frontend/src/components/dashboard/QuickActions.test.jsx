import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import QuickActions from './QuickActions';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('QuickActions shortcuts', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('shows all dashboard shortcuts and navigates to the correct destinations', () => {
    render(
      <MemoryRouter>
        <QuickActions />
      </MemoryRouter>,
    );

    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.map((node) => node.textContent)).toEqual([
      'Add Availability',
      'Schedule Meeting',
      'View Notifications',
      'Manage Skills',
    ]);

    const availabilityCard = headings[0].parentElement.parentElement;
    fireEvent.click(availabilityCard);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/availability');

    const scheduleCard = headings[1].parentElement.parentElement;
    fireEvent.click(scheduleCard);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/contact-requests');
  });
});
