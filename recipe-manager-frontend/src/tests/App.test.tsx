// noinspection JSUnusedGlobalSymbols

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

vi.mock('@react-keycloak/web', () => ({
  ReactKeycloakProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('../auth/useAuth.ts', () => ({
  useAuth: () => ({
    authenticated: false,
    username: undefined,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

import { App } from '../App.tsx';

describe('App routing', () => {
  it('renders NotFound for unknown routes', () => {
    window.history.pushState({}, 'Test page', '/definitely-unknown-route');

    render(<App />);

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByText(/the page you are looking for does not exist/i)).toBeInTheDocument();
  });
});
