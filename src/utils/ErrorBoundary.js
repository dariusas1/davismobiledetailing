import React, { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false,
            error: null,
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        this.logErrorToService(error, errorInfo);
        
        // You can also update state to display error details
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    logErrorToService(error, errorInfo) {
        // In a real-world scenario, this would send error to a logging service
        console.error('Uncaught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="error-boundary" style={{
                    padding: '20px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '5px',
                    margin: '10px',
                    textAlign: 'center'
                }}>
                    <h2>Something went wrong in Precision Detailing App</h2>
                    <p>We apologize for the inconvenience. Please try refreshing the page.</p>
                    {this.state.error && (
                        <details style={{
                            backgroundColor: '#fff',
                            padding: '10px',
                            marginTop: '10px',
                            borderRadius: '5px'
                        }}>
                            <summary>Error Details (Click to Expand)</summary>
                            <p>{this.state.error.toString()}</p>
                            <pre>{this.state.errorInfo?.componentStack}</pre>
                        </details>
                    )}
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
