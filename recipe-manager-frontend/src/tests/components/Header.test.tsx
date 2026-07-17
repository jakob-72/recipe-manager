import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('../../auth/useAuth.ts', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../auth/useAuth.ts';
import { Header } from '../../components/Header.tsx';

const mockedAuthHook = vi.mocked(useAuth);

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays user information when logged in', () => {
    mockedAuthHook.mockReturnValue({
      authenticated: true,
      username: 'Tester',
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderHeader();

    expect(screen.getByText(/recipe manager/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open user menu/i })).toBeInTheDocument();
    expect(screen.getByText('TE')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
  });

  it('displays login button when logged out', () => {
    mockedAuthHook.mockReturnValue({
      authenticated: false,
      username: undefined,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderHeader();

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /open user menu/i })).not.toBeInTheDocument();
  });

  it('calls login from auth hook when login button is clicked', () => {
    const loginMock = vi.fn();

    mockedAuthHook.mockReturnValue({
      authenticated: false,
      username: undefined,
      login: loginMock,
      logout: vi.fn(),
    });

    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(loginMock).toHaveBeenCalledTimes(1);
    expect(loginMock).toHaveBeenCalledWith(window.location.href);
  });

  it('calls logout from auth hook when logout button is clicked', async () => {
    const logoutMock = vi.fn();

    mockedAuthHook.mockReturnValue({
      authenticated: true,
      username: 'Tester',
      login: vi.fn(),
      logout: logoutMock,
    });

    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: /open user menu/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /logout/i }));

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
