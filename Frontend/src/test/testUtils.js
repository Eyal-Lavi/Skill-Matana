import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

const defaultUser = {
  id: 101,
  firstName: 'Testy',
  lastName: 'User',
  skills: [],
  connections: [],
};

export const buildAuthState = (overrides = {}) => ({
  auth: {
    isAuthenticated: true,
    user: {
      ...defaultUser,
      ...overrides,
      skills: overrides.skills ?? [],
      connections: overrides.connections ?? [],
    },
  },
});

export function renderWithProviders(ui, { preloadedState = buildAuthState(), route = '/' } = {}) {
  const store = configureStore({
    reducer: (state = preloadedState, action) => {
      switch (action.type) {
        default:
          return state;
      }
    },
    preloadedState,
  });

  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
}
