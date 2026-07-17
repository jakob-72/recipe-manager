import { beforeEach, describe, vi, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

vi.mock('../../auth/useAuth.ts', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../auth/useAuth.ts';
import { Home } from '../../pages/Home.tsx';

const mockedAuthHook = vi.mocked(useAuth);
const renderHomePage = () => {
  render(
    <MemoryRouter>
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/recipes'} element={<div>Recipes Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render Home page when no user is authenticated', () => {
    mockedAuthHook.mockReturnValue({
      authenticated: false,
      username: undefined,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderHomePage();

    expect(screen.getByText(/welcome to recipe manager/i)).toBeInTheDocument();
    expect(
      screen.getByText(/sign in to browse, create, and manage your recipes/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('Should redirect to recipes page when logged in', () => {
    mockedAuthHook.mockReturnValue({
      authenticated: true,
      username: 'Tester',
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderHomePage();

    expect(screen.getByText(/recipes/i)).toBeInTheDocument();
    expect(screen.queryByText(/welcome to recipe manager/i)).not.toBeInTheDocument();
  });
});
