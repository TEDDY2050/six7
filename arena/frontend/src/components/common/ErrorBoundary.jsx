import React from 'react';
import { Gamepad2, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-dark-50 flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <Gamepad2 size={64} className="mx-auto text-red-500/40 mb-6" />
                        <h1 className="text-3xl font-display font-bold mb-3">Something Went Wrong</h1>
                        <p className="text-dark-700 mb-6">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all"
                        >
                            <RefreshCw size={18} /> Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
