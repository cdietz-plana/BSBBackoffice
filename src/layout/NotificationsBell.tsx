import { useMemo, useState } from 'react';
import { Badge, Button, Popover, List, Typography, Empty, Tooltip } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { AlertTriangle, RefreshCcw, Info, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { brand } from '@/theme/theme';

const { Text, Title } = Typography;

type AlertType = 'timeout' | 'sync' | 'version' | 'login';

interface Alert {
  id: string;
  type: AlertType;
  titleKey: string;
  descKey: string;
  descVars: Record<string, string>;
  time: string;
  read: boolean;
}

const ICONS: Record<AlertType, { icon: typeof Info; color: string }> = {
  timeout: { icon: AlertTriangle, color: brand.error },
  sync: { icon: RefreshCcw, color: brand.warning },
  version: { icon: Info, color: brand.gold },
  login: { icon: LogIn, color: brand.success },
};

/** Seeded mock system alerts. PROVISIONAL — notifications not in source screens. */
const SEED: Alert[] = [
  { id: 'n1', type: 'timeout', titleKey: 'notif.tableTimeout', descKey: 'notif.tableTimeoutDesc', descVars: { table: 'CTBB03' }, time: '2m', read: false },
  { id: 'n2', type: 'sync', titleKey: 'notif.syncError', descKey: 'notif.syncErrorDesc', descVars: { pit: '01' }, time: '18m', read: false },
  { id: 'n3', type: 'timeout', titleKey: 'notif.tableTimeout', descKey: 'notif.tableTimeoutDesc', descVars: { table: '90BB06' }, time: '1h', read: false },
  { id: 'n4', type: 'version', titleKey: 'notif.version', descKey: 'notif.versionDesc', descVars: { v: '1.3.11' }, time: '3h', read: true },
  { id: 'n5', type: 'login', titleKey: 'notif.login', descKey: 'notif.loginDesc', descVars: { user: 'QATG001' }, time: '1d', read: true },
];

export function NotificationsBell() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<Alert[]>(SEED);
  const [open, setOpen] = useState(false);

  const unread = useMemo(() => alerts.filter((a) => !a.read).length, [alerts]);

  const markRead = (id: string) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  const markAllRead = () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));

  const panel = (
    <div style={{ width: 340 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 4px 10px',
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          {t('notif.title')}
          {unread > 0 && (
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400, marginInlineStart: 8 }}>
              {t('notif.unread', { count: unread })}
            </Text>
          )}
        </Title>
        <Button type="link" size="small" disabled={unread === 0} onClick={markAllRead} style={{ paddingInline: 0 }}>
          {t('notif.markAllRead')}
        </Button>
      </div>

      {alerts.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('notif.empty')} />
      ) : (
        <List
          size="small"
          dataSource={alerts}
          style={{ maxHeight: 360, overflow: 'auto' }}
          renderItem={(a) => {
            const { icon: Icon, color } = ICONS[a.type];
            return (
              <List.Item
                onClick={() => markRead(a.id)}
                style={{
                  cursor: 'pointer',
                  paddingInline: 6,
                  borderRadius: 8,
                  background: a.read ? 'transparent' : 'rgba(176,141,70,0.06)',
                }}
              >
                <List.Item.Meta
                  avatar={
                    <span
                      style={{
                        display: 'inline-flex',
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `${color}1a`,
                        color,
                      }}
                    >
                      <Icon size={16} />
                    </span>
                  }
                  title={
                    <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <Text strong={!a.read} style={{ fontSize: 13 }}>
                        {t(a.titleKey)}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                        {a.time}
                      </Text>
                    </span>
                  }
                  description={
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {t(a.descKey, a.descVars)}
                    </Text>
                  }
                />
                {!a.read && (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: brand.gold,
                      flexShrink: 0,
                      marginInlineStart: 6,
                    }}
                  />
                )}
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );

  return (
    <Popover content={panel} trigger="click" placement="bottomRight" open={open} onOpenChange={setOpen}>
      <Tooltip title={t('header.notifications')}>
        <Badge count={unread} size="small" offset={[-2, 4]} color={brand.gold}>
          <Button
            type="text"
            aria-label="notifications"
            icon={<BellOutlined style={{ color: brand.headerText, fontSize: 17 }} />}
          />
        </Badge>
      </Tooltip>
    </Popover>
  );
}
