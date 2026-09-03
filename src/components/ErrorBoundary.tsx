import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Compass, Terminal, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('[AuraPredict ErrorBoundary caught an exception]:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[360px] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-rose-500/20 text-slate-100 shadow-xl">
          <div className="max-w-xl w-full flex flex-col items-center text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight text-white">
                {this.props.fallbackTitle || 'Component Encountered an Interruption'}
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                A non-fatal rendering issue was caught by AuraPredict telemetry guardrails. Your active state and telemetry cache remain safely preserved.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-all shadow-md active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recover View</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium rounded-xl transition-all active:scale-95"
              >
                <Compass className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{this.state.showDetails ? 'Hide Diagnostics' : 'Inspect Stack'}</span>
              </button>
            </div>

            {this.state.showDetails && (
              <div className="w-full text-left bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs font-mono text-rose-300/90 overflow-x-auto max-h-48 custom-scrollbar">
                <div className="font-semibold text-rose-400 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {this.state.error?.name || 'Error'}: {this.state.error?.message}
                </div>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[11px] text-slate-400 whitespace-pre-wrap leading-relaxed mt-2 border-t border-slate-800/80 pt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
