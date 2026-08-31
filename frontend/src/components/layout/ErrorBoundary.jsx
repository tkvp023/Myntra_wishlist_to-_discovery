import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white min-h-[300px]">
          <div className="w-12 h-12 rounded-full bg-[#FFF0F3] text-[#FF3F6C] flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-black text-[#282C3F] mb-1">
            Something went wrong
          </h2>
          <p className="text-xs text-[#535766] mb-4 max-w-xs leading-relaxed font-normal">
            We encountered a temporary rendering issue. Please tap below to refresh the view.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FF3F6C] text-white text-xs font-bold rounded-lg hover:bg-[#E0355E] cursor-pointer shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Page</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
