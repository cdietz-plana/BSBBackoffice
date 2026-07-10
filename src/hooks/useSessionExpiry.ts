import { useEffect, useRef } from 'react';
import { App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/** Idle window before the session expires and redirects to login. */
const SESSION_IDLE_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Session-expiry guard. Resets an idle timer on user activity; when the window
 * elapses it warns and redirects to /login — the reskin's stand-in for a real
 * 401/token-expiry flow. Mounted inside the authenticated shell only.
 *
 * For the walkthrough you can trigger it immediately from the console with
 * `window.__expireSession()` instead of waiting out the timer.
 */
export function useSessionExpiry() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { t } = useTranslation();
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const expire = () => {
      message.warning(t('session.expiredMsg'));
      navigate('/login');
    };
    const reset = () => {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(expire, SESSION_IDLE_MS);
    };
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    // Dev/testing affordance — invoke expiry without waiting.
    (window as unknown as { __expireSession?: () => void }).__expireSession = expire;

    return () => {
      window.clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, reset));
      delete (window as unknown as { __expireSession?: () => void }).__expireSession;
    };
  }, [navigate, message, t]);
}
