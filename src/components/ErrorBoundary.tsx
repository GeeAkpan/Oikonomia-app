import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const isExtensionError =
        this.state.error?.message?.toLowerCase().includes('metamask') ||
        this.state.error?.message?.toLowerCase().includes('proxy');

      if (isExtensionError) {
        // Automatically recover from browser extension injection errors
        setTimeout(() => this.setState({ hasError: false, error: null }), 100);
      }

      return (
        <div className="min-h-screen bg-[#0a0b0d] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-[#16171a] border border-white/10 rounded-2xl p-6 max-w-md shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-emerald-400">Application Notice</h2>
            <p className="text-xs text-white/70">
              An unexpected display issue occurred. If you have browser wallet extensions active, they may interfere with preview frames.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer"
            >
              Reload View
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
