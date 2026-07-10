import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/** 404 — unknown route. */
export function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: 24 }}>
      <Result
        status="404"
        title={t('states.notFoundTitle')}
        subTitle={t('states.notFoundHint')}
        extra={
          <Button type="primary" onClick={() => navigate('/app')}>
            {t('states.goHome')}
          </Button>
        }
      />
    </div>
  );
}
