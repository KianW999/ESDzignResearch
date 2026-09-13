import { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-950 text-slate-100 p-6 text-center font-sans">
          <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
            <h1 className="text-xl font-bold mb-2 text-white">Portfolio Gallery Unavailable</h1>
            <p className="text-sm text-slate-400 mb-6">
              {this.state.error?.message || "An unexpected error occurred while loading the 3D gallery."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-white text-slate-950 font-semibold text-sm rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Reload Portfolio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Explicitly cancel fallback timer and remove pre-hydration loader screen upon React bootstrap
if (typeof window !== 'undefined') {
  if ((window as any).__loaderTimer) {
    clearTimeout((window as any).__loaderTimer);
  }
  const loaderEl = document.getElementById('initial-loader');
  if (loaderEl) {
    loaderEl.remove();
  }
}

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
