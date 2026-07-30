import React, { ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: ErrorBoundaryProps;
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React application:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('rcm_current_view');
    } catch (e) {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1A100C] text-[#E8DCCF] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-[#2C1B15] border border-[#9E7649]/30 rounded-2xl p-8 max-w-md shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-[#9E7649]/20 rounded-full flex items-center justify-center mx-auto text-[#C69C6D]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Radio Ciudad Monumento</h1>
            <p className="text-sm text-[#E8DCCF]/80">
              Ocurrió un inconveniente al cargar la interfaz. Hemos registrado el evento para resolverlo.
            </p>
            {this.state.error && (
              <p className="text-xs bg-[#1A100C] p-3 rounded-lg text-red-300 font-mono text-left overflow-auto max-h-24 border border-red-900/30">
                {this.state.error.message || 'Error desconocido'}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 bg-[#C69C6D] hover:bg-[#b58b5c] text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
            >
              Reiniciar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);