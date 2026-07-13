import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    // Attempt to recover by resetting state and hard-reloading
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#121316] p-4">
          <div className="bg-white dark:bg-[#181a1f] p-8 rounded-lg shadow-xl border border-gray-200 dark:border-white/10 max-w-lg w-full text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              Oops, something went wrong.
            </h1>
            
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm leading-relaxed">
              We've encountered an unexpected error and the system cannot continue safely. The issue has been logged. Please try reloading the page.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-black/40 rounded text-left overflow-x-auto text-xs font-mono text-red-600 dark:text-red-400">
                {this.state.error.toString()}
              </div>
            )}

            <button 
              onClick={this.handleReset}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-[#792359] hover:bg-[#5d1943] text-white rounded-md font-medium text-sm transition-colors shadow-sm"
            >
              <RefreshCcw size={16} className="mr-2" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
