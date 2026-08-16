import React from 'react';
import './ErrorBoundary.css';
import { FiAlertTriangle, FiRefreshCw, FiHome, FiChevronDown } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
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
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    // Hard reload the window to reset all state cleanly
    window.location.reload();
  };

  handleReturnHome = () => {
    // Hard redirect to landing page to ensure all routes and stores are completely reset
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Premium branded fallback UI
      return (
        <div className="error-boundary-container">
          <div className="error-blob-1"></div>
          <div className="error-blob-2"></div>
          
          <div className="error-card">
            <div className="error-icon-wrapper">
              <FiAlertTriangle />
            </div>
            
            <h1 className="error-title">Oops! Something went wrong</h1>
            
            <p className="error-message">
              Quick Plate encountered an unexpected error. Don't worry, your data is safe. Please try reloading or returning home.
            </p>
            
            <div className="error-cta-group">
              <button 
                onClick={this.handleReload} 
                className="error-btn-primary"
                aria-label="Reload Application"
              >
                <FiRefreshCw />
                Reload Application
              </button>
              
              <button 
                onClick={this.handleReturnHome} 
                className="error-btn-secondary"
                aria-label="Return to Home"
              >
                <FiHome />
                Return to Home
              </button>
            </div>
            
            {/* Developer/Technical Details section for debuggability */}
            <div className="error-details-wrapper">
              <details>
                <summary className="error-details-summary">
                  <span>Show Diagnostic Details</span>
                  <FiChevronDown className="error-details-chevron" />
                </summary>
                
                <div className="error-details-content">
                  <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
                    {this.state.error && this.state.error.toString()}
                  </strong>
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </div>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
