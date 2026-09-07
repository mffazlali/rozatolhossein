'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetOnPropsChange?: boolean
  className?: string
}

/**
 * Error Fallback Props
 */
export interface ErrorFallbackProps {
  error: Error
  retry: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Note: Must be a class component as React doesn't support Error Boundaries in function components
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo)
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error boundary when resetOnPropsChange is true and props change
    if (this.props.resetOnPropsChange && this.state.hasError && prevProps.children !== this.props.children) {
      this.reset()
    }
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} retry={this.reset} />
      }

      // Render default error UI
      return (
        <div className={`flex flex-col items-center justify-center gap-6 py-20 px-4 ${this.props.className || ''}`}>
          {/* Icon */}
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-theme-primary-red/10 border border-theme-primary-red/20">
            <i className="fa-light fa-triangle-exclamation text-4xl text-theme-primary-red" />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-xl font-bold text-theme-white">متأسفانه خطایی رخ داده است</h2>
            <p className="text-theme-gray text-base max-w-md">
              لطفاً صفحه را مجدداً بارگذاری کنید یا با پشتیبانی تماس بگیرید.
            </p>
          </div>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="w-full max-w-lg">
              <summary className="cursor-pointer text-sm text-theme-gray hover:text-theme-white transition-colors">
                جزئیات خطا (فقط در حالت توسعه)
              </summary>
              <pre className="mt-2 bg-theme-black p-4 rounded-lg text-xs text-theme-gray overflow-auto border border-theme-border">
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          {/* Action Button */}
          <button
            onClick={this.reset}
            className="flex items-center gap-2 bg-theme-primary-teal text-theme-white px-6 py-3 rounded-xl hover:bg-theme-primary-teal/80 transition-colors"
          >
            <i className="fa-light fa-rotate-right text-lg" />
            <span>تلاش مجدد</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
