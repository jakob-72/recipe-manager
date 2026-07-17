import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

vi.mock('../../auth/useAuth.ts', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../auth/useAuth.ts';
import { Authenticated } from '../../auth/Authenticated.tsx';

const mockedAuthHook = vi.mocked(useAuth);

const renderProtectedRoute = () =>
  render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/" element={<div>Public Page</div>} />
        <Route
          path="/protected"
          element={
            <Authenticated>
              <div>Protected Content</div>
            </Authenticated>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

describe('Authenticated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to "/" when user is not authenticated', () => {
    mockedAuthHook.mockReturnValue({
      authenticated: false,
      username: undefined,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderProtectedRoute();

    expect(screen.getByText('Public Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders the protected route when user is authenticated', () => {
    mockedAuthHook.mockReturnValue({
      authenticated: true,
      username: 'Tester',
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderProtectedRoute();

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Public Page')).not.toBeInTheDocument();
  });
});
