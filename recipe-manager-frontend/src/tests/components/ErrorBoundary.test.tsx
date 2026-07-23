import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../../components/ErrorBoundary.tsx';

const ThrowingComponent = () => {
  throw new Error('boom');
};

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a fallback message with recovery actions when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/please try one of the options below/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to home page/i })).toHaveAttribute('href', '/');
  });

  it('reloads the page when reload is clicked', () => {
    const reloadHandlerSpy = vi
      .spyOn(ErrorBoundary.prototype as unknown as { handleReload: () => void }, 'handleReload')
      .mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByRole('button', { name: /reload page/i }));
    expect(reloadHandlerSpy).toHaveBeenCalledOnce();
  });

  it('goes back when go back is clicked', () => {
    const goBackHandlerSpy = vi
      .spyOn(ErrorBoundary.prototype as unknown as { handleGoBack: () => void }, 'handleGoBack')
      .mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByRole('button', { name: /go back/i }));
    expect(goBackHandlerSpy).toHaveBeenCalledOnce();
  });
});
