import { useState } from 'react';
import { Layout, Grid } from 'antd';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { AppFooter } from './AppFooter';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';

const { Content } = Layout;

/**
 * The single app shell every page inherits: dark header, ivory sidebar, white
 * content canvas, subtle footer. The sidebar auto-collapses on narrow screens.
 */
export function AppLayout() {
  const screens = Grid.useBreakpoint();
  const [manualCollapsed, setManualCollapsed] = useState(false);
  useSessionExpiry();

  // Collapse automatically below `lg`; otherwise honour the manual toggle.
  const collapsed = screens.lg === false ? true : manualCollapsed;

  return (
    // `app-canvas` paints the lion watermark behind the whole shell; the
    // frosted-glass header/sidebar/cards blur over it.
    <Layout className="app-canvas" style={{ minHeight: '100vh' }}>
      <AppHeader
        collapsed={collapsed}
        onToggleCollapse={() => setManualCollapsed((v) => !v)}
      />
      <Layout hasSider style={{ background: 'transparent' }}>
        <AppSidebar collapsed={collapsed} />
        <Layout style={{ background: 'transparent' }}>
          <Content
            style={{
              padding: screens.md ? '20px 24px' : '14px 12px',
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
          <AppFooter />
        </Layout>
      </Layout>
    </Layout>
  );
}
