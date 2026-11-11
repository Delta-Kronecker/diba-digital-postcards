import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Diba ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50svh] flex-col items-center justify-center p-8 text-center" role="alert">
          <h2 className="font-display text-2xl font-medium text-ink">خطایی در نمایش این بخش رخ داده است.</h2>
          <p className="mt-2 text-sm text-ink-muted">لطفاً صفحه را دوباره بارگذاری کنید یا به صفحه اصلی بازگردید.</p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            className="btn btn-ink mt-6"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
