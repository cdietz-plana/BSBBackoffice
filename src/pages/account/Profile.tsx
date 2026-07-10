import { Form, Input, Button, Upload, Row, Col, Divider, Typography, Avatar, Space } from 'antd';
import { PlusOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { App as AntApp } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/PageHeader';
import { ContentCard } from '@/components/ContentCard';
import { brand } from '@/theme/theme';

const { Title, Text } = Typography;

/** My Profile form — mirrors the production fields; save is UI-only. */
export function Profile() {
  const { t } = useTranslation();
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();

  return (
    <>
      <PageHeader titleKey="profile.title" />
      <ContentCard>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 720 }}
          initialValues={{
            id: '22',
            userAccountName: 'QATG003',
            authHandler: 'DB',
          }}
          onFinish={() => message.success(t('profile.saved'))}
        >
          <Space align="center" size={16} style={{ marginBottom: 20 }}>
            <Avatar size={64} icon={<UserOutlined />} style={{ background: brand.goldTint, color: brand.goldDeep }}>
              QA
            </Avatar>
            <div>
              <Title level={5} style={{ margin: 0 }}>
                QATG003
              </Title>
              <Text type="secondary">iN Systems (Macao) Ltd.</Text>
            </div>
          </Space>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label={t('profile.id')} name="id">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={t('profile.userAccountName')} name="userAccountName">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={t('profile.lastName')} name="lastName">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={t('profile.firstName')} name="firstName">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={t('profile.email')}
                name="email"
                rules={[{ type: 'email', message: t('common.required') }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={t('profile.telephone')} name="telephone">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={t('profile.authHandler')} name="authHandler">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Title level={5}>{t('profile.images')}</Title>
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{t('profile.uploadImage')}</div>
            </div>
          </Upload>

          <Divider />
          <Title level={5}>{t('profile.attachments')}</Title>
          <Upload beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>{t('profile.uploadAttachment')}</Button>
          </Upload>

          <Divider />
          <Button type="primary" htmlType="submit">
            {t('common.save')}
          </Button>
        </Form>
      </ContentCard>
    </>
  );
}
