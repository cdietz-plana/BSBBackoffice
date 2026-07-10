import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Result } from 'antd';
import { useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Route-level error element. React Router renders this when a route throws
 * during render/loading. Shown as a friendly, branded error state.
 */
export function RouteError() {
  const { t } = useTranslation();
  const error = useRouteError();
  // eslint-disable-next-line no-console
  console.error('Route error:', error);
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', padding: 24 }}>
      <Result
        status="error"
        title={t('states.errorTitle')}
        subTitle={t('states.errorHint')}
        extra={
          <Button type="primary" onClick={() => window.location.reload()}>
            {t('states.reload')}
          </Button>
        }
      />
    </div>
  );
}

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

/**
 * Top-level class error boundary — catches render errors anywhere below it that
 * React Router's errorElement doesn't (e.g. outside the data router tree).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('App error boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: 24 }}>
          <Result
            status="error"
            title="Something went wrong"
            subTitle="An unexpected error occurred. Please reload the page."
            extra={
              <Button type="primary" onClick={() => window.location.reload()}>
                Reload
              </Button>
            }
          />
        </div>
      );
    }
    return this.props.children;
  }
}
