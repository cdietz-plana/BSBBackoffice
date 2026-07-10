import { Layout, Button, Dropdown, Segmented, Tooltip, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { brand, layout } from '@/theme/theme';
import { useUiSettings } from '@/theme/ThemeProvider';
import { LANGUAGES } from '@/i18n';
import { NotificationsBell } from './NotificationsBell';
import type { FontScaleKey } from '@/theme/theme';

const { Header } = Layout;

const CURRENT_USER = 'QATG003';

export function AppHeader({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { fontScale, setFontScale, editMode, toggleEditMode } = useUiSettings();

  const userMenu: MenuProps['items'] = [
    {
      key: 'vnext',
      icon: <Sparkles size={15} style={{ color: brand.gold }} />,
      label: (
        <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1.25 }}>
          <span style={{ fontWeight: 600 }}>{t('header.tryVNext')}</span>
          <span style={{ fontSize: 11, color: brand.gold }}>{t('header.tryVNextHint')} ✨</span>
        </span>
      ),
    },
    { type: 'divider' },
    { key: 'profile', icon: <UserOutlined />, label: t('header.myProfile') },
    { key: 'password', label: t('header.changePassword') },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: t('header.logout'), danger: true },
  ];

  const onUserMenu: MenuProps['onClick'] = ({ key }) => {
    if (key === 'vnext') navigate('/vnext');
    if (key === 'profile') navigate('/app/account/profile');
    if (key === 'password') navigate('/app/account/password');
    if (key === 'logout') navigate('/login');
  };

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: 16,
        position: 'sticky',
        top: 0,
        zIndex: 20,
        height: layout.headerHeight,
        lineHeight: `${layout.headerHeight}px`,
        // Frosted glass: blur what scrolls beneath + a faint gold hairline.
        backdropFilter: brand.glassBlur,
        WebkitBackdropFilter: brand.glassBlur,
        borderBottom: `1px solid ${brand.glassBorder}`,
      }}
    >
      {/* Left: collapse toggle + wordmark */}
      <Space size={12} align="center">
        <Button
          type="text"
          aria-label="toggle-sidebar"
          onClick={onToggleCollapse}
          icon={
            collapsed ? (
              <MenuUnfoldOutlined style={{ color: brand.headerText, fontSize: 18 }} />
            ) : (
              <MenuFoldOutlined style={{ color: brand.headerText, fontSize: 18 }} />
            )
          }
        />
        <span
          style={{
            color: brand.headerText,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: 0.3,
          }}
        >
          {t('app.name')}
        </span>
      </Space>

      {/* Right: edit toggle · font size · language · bell · user */}
      <Space size={14} align="center">
        <Tooltip title={t('header.editMode')}>
          <Button
            type="text"
            aria-label="edit-mode"
            onClick={toggleEditMode}
            icon={
              <EditOutlined
                style={{
                  color: editMode ? brand.gold : brand.headerTextMuted,
                  fontSize: 16,
                }}
              />
            }
          />
        </Tooltip>

        {/* A · A · A font-size control */}
        <Segmented<FontScaleKey>
          size="small"
          value={fontScale}
          onChange={(v) => setFontScale(v)}
          options={[
            { value: 'small', label: <span style={{ fontSize: 12 }}>A</span> },
            { value: 'default', label: <span style={{ fontSize: 15 }}>A</span> },
            { value: 'large', label: <span style={{ fontSize: 18 }}>A</span> },
          ]}
        />

        {/* EN / 繁體中文 */}
        <Segmented<string>
          size="small"
          value={i18n.language}
          onChange={(v) => i18n.changeLanguage(v)}
          options={LANGUAGES.map((l) => ({ value: l.key, label: t(l.labelKey) }))}
        />

        <NotificationsBell />

        <Dropdown menu={{ items: userMenu, onClick: onUserMenu }} trigger={['click']}>
          <Space
            size={8}
            style={{ cursor: 'pointer', color: brand.headerText, paddingInline: 4 }}
          >
            <UserOutlined style={{ fontSize: 16 }} />
            <span style={{ fontWeight: 500 }}>{CURRENT_USER}</span>
            <DownOutlined style={{ fontSize: 10, color: brand.headerTextMuted }} />
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}
