import { useState } from 'react';
import { Form, Input, Button, Segmented, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MgmLogo } from '@/components/MgmLogo';
import { LANGUAGES } from '@/i18n';
import { brand } from '@/theme/theme';

const { Title, Text, Link } = Typography;

interface Credentials {
  username: string;
  password: string;
}

/**
 * Centered MGM login. No auth backend — any credentials sign in after a short
 * loading state; password "wrong" demonstrates the invalid-credentials error.
 * // PROVISIONAL — demo auth rule; real validation happens server-side.
 */
export function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const handleFinish = (values: Credentials) => {
    setError(false);
    setSubmitting(true);
    // Simulate an auth round-trip.
    window.setTimeout(() => {
      setSubmitting(false);
      if (values.password === 'wrong') {
        setError(true);
      } else {
        navigate('/app/maintenance/pit-location');
      }
    }, 800);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: `radial-gradient(1200px 600px at 50% -10%, #F3E9D5 0%, ${brand.canvasBg} 55%)`,
        padding: 24,
      }}
    >
      <div
        style={{
          width: 'min(400px, 100%)',
          background: brand.contentBg,
          border: `1px solid ${brand.border}`,
          borderRadius: 16,
          padding: '36px 32px 28px',
          boxShadow: '0 12px 40px rgba(31, 27, 22, 0.08)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <MgmLogo size={96} />
          <Title level={3} style={{ marginTop: 16, marginBottom: 2 }}>
            {t('login.title')}
          </Title>
          <Text type="secondary">{t('login.subtitle')}</Text>
        </div>

        <Form
          layout="vertical"
          requiredMark={false}
          onFinish={handleFinish}
        >
          {error && (
            <Alert
              type="error"
              showIcon
              message={t('login.invalid')}
              style={{ marginBottom: 16 }}
            />
          )}
          <Form.Item
            name="username"
            rules={[{ required: true, message: t('login.usernameRequired') }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined style={{ color: brand.textSecondary }} />}
              placeholder={t('login.username')}
              autoComplete="username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: t('login.passwordRequired') }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ color: brand.textSecondary }} />}
              placeholder={t('login.password')}
              autoComplete="current-password"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={submitting}
          >
            {t('login.signIn')}
          </Button>
          <Text
            type="secondary"
            style={{ display: 'block', marginTop: 10, fontSize: 12, textAlign: 'center' }}
          >
            {t('login.demoHint')}
          </Text>
        </Form>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <Link onClick={() => navigate('/app/account/password')}>
            {t('login.changePassword')}
          </Link>
          <Segmented<string>
            size="small"
            value={i18n.language}
            onChange={(v) => i18n.changeLanguage(v)}
            options={LANGUAGES.map((l) => ({ value: l.key, label: t(l.labelKey) }))}
          />
        </div>
      </div>

      <Text type="secondary" style={{ position: 'fixed', bottom: 16, fontSize: 12 }}>
        {t('footer.copyright')}
      </Text>
    </div>
  );
}
