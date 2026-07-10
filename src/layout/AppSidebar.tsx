import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_GROUPS } from '@/config/navigation';
import { NavIcon } from '@/components/Icon';
import { MgmLogo } from '@/components/MgmLogo';
import { brand, layout } from '@/theme/theme';

const { Sider } = Layout;

export function AppSidebar({ collapsed }: { collapsed: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Active key = the nav path segment after /app/
  const selectedKey = location.pathname.replace(/^\/app\//, '');

  const items: MenuProps['items'] = NAV_GROUPS.map((group) => ({
    key: group.key,
    label: t(group.labelKey),
    icon: <NavIcon name={group.icon} />,
    children: group.items.map((item) => ({
      key: item.path,
      label: t(item.labelKey),
      icon: <NavIcon name={item.icon} />,
    })),
  }));

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={layout.sidebarWidth}
      collapsedWidth={layout.sidebarCollapsedWidth}
      style={{
        borderRight: `1px solid ${brand.sidebarBorder}`,
        overflow: 'auto',
        height: `calc(100vh - ${layout.headerHeight}px)`,
        position: 'sticky',
        top: layout.headerHeight,
        backdropFilter: brand.glassBlur,
        WebkitBackdropFilter: brand.glassBlur,
      }}
    >
      {/* Brand block */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: collapsed ? '16px 0' : '20px 0 16px',
          borderBottom: `1px solid ${brand.sidebarBorder}`,
        }}
      >
        <MgmLogo size={collapsed ? 40 : 76} />
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={NAV_GROUPS.map((g) => g.key)}
        onClick={({ key }) => navigate(`/app/${key}`)}
        items={items}
        style={{ borderInlineEnd: 'none', paddingBlock: 8, background: 'transparent' }}
      />
    </Sider>
  );
}
