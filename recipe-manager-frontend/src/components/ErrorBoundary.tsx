import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  private handleReload(): void {
    window.location.reload();
  }

  private handleGoBack(): void {
    window.history.back();
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div role="alert" aria-live="assertive">
          <h2>Something went wrong</h2>
          <p>This didn&apos;t work. Please try one of the options below.</p>
          <button type="button" onClick={() => this.handleReload()}>
            Reload page
          </button>
          <button type="button" onClick={() => this.handleGoBack()}>
            Go back
          </button>
          <a href="/">Go to home page</a>
        </div>
      );
    }

    return this.props.children;
  }
}
