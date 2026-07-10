import { Breadcrumb, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import { brand } from '@/theme/theme';

const { Title } = Typography;

export interface PageHeaderProps {
  /** i18n key for the group crumb, e.g. 'nav.maintenance'. */
  groupKey?: string;
  /** i18n key for the page title / last crumb, e.g. 'nav.pit'. */
  titleKey: string;
  /** Optional right-aligned actions (rarely used — most actions live in toolbars). */
  extra?: ReactNode;
}

/** Breadcrumb + page title. Consistent across every screen. */
export function PageHeader({ groupKey, titleKey, extra }: PageHeaderProps) {
  const { t } = useTranslation();
  const crumbs = [
    ...(groupKey ? [{ title: t(groupKey) }] : []),
    { title: t(titleKey) },
  ];

  return (
    <div style={{ marginBottom: 16 }}>
      <Breadcrumb items={crumbs} style={{ fontSize: 13, marginBottom: 8 }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <Title level={3} style={{ margin: 0, color: brand.textPrimary, fontWeight: 600 }}>
          {t(titleKey)}
        </Title>
        {extra}
      </div>
    </div>
  );
}
