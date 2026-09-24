import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Unhandled Application Exception:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-[var(--color-background)]">
          <div className="max-w-xl w-full text-center">
            
            <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center mx-auto mb-6 shadow-xl">
              <AlertTriangle className="w-8 h-8 text-[var(--color-accent-light)]" />
            </div>

            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[var(--color-primary)] block mb-2">
              System Notice
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-4">
              Something Unexpected Occurred
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8 font-light">
              An unexpected error interrupted this view. Your stored shopping cart and preferences remain safe.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button
                onClick={this.handleReload}
                size="lg"
                className="w-full sm:w-auto bg-gold-gradient text-black font-bold uppercase text-xs tracking-widest px-6"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-[var(--color-border-gold)] text-white hover:bg-[var(--color-primary)]/10 font-bold uppercase text-xs tracking-widest px-6"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-8 text-left bg-black/60 border border-red-900/40 rounded-xl p-4 text-xs font-mono text-red-300 overflow-auto max-h-48">
                <summary className="cursor-pointer font-bold mb-2">
                  Developer Error Details (Visible in Dev Only)
                </summary>
                <pre className="whitespace-pre-wrap">{this.state.error.stack || this.state.error.message}</pre>
              </details>
            )}

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
