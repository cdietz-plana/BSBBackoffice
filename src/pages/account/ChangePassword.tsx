import { Form, Input, Button, Typography } from 'antd';
import { App as AntApp } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/PageHeader';
import { ContentCard } from '@/components/ContentCard';
import { brand } from '@/theme/theme';

const { Text } = Typography;

/** 0–4 strength score from length + character-class variety. */
function scorePassword(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

/** Weak / Fair / Strong meter shown under the new-password field. */
function StrengthMeter({ value }: { value: string }) {
  const { t } = useTranslation();
  const score = scorePassword(value);
  const level = score <= 1 ? 0 : score <= 3 ? 1 : 2; // weak / fair / strong
  const colors = [brand.error, brand.warning, brand.success];
  const labels = [t('password.weak'), t('password.fair'), t('password.strong')];
  if (!value) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              background: i <= level ? colors[level] : brand.border,
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>
      <Text style={{ fontSize: 12, color: colors[level] }}>
        {t('password.strength')}: {labels[level]}
      </Text>
    </div>
  );
}

/** Change Password — Old / New (with strength meter) / Confirm. UI-only. */
export function ChangePassword() {
  const { t } = useTranslation();
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();
  const newPassword = Form.useWatch('new', form) ?? '';

  return (
    <>
      <PageHeader titleKey="password.title" />
      <ContentCard>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 420 }}
          onFinish={() => {
            message.success(t('password.changed'));
            form.resetFields();
          }}
        >
          <Form.Item
            label={t('password.old')}
            name="old"
            rules={[{ required: true, message: t('common.required') }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label={t('password.new')}
            name="new"
            rules={[
              { required: true, message: t('common.required') },
              { min: 8, message: t('password.minLength') },
              {
                validator: (_, value) =>
                  !value || scorePassword(value) >= 2
                    ? Promise.resolve()
                    : Promise.reject(new Error(t('password.tooWeak'))),
              },
            ]}
            extra={<StrengthMeter value={newPassword} />}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label={t('password.confirm')}
            name="confirm"
            dependencies={['new']}
            rules={[
              { required: true, message: t('common.required') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new') === value) return Promise.resolve();
                  return Promise.reject(new Error(t('password.mismatch')));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {t('common.save')}
          </Button>
        </Form>
      </ContentCard>
    </>
  );
}
