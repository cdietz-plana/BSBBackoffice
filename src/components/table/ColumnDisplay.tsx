import { Popover, Button, Checkbox, Space, Typography, Tooltip } from 'antd';
import {
  SettingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { brand } from '@/theme/theme';

export interface ColumnMeta {
  key: string;
  title: string;
  visible: boolean;
  toggleable: boolean;
}

/**
 * The Column Display gear: toggle visibility and reorder columns. Reordering
 * uses up/down controls (robust, keyboard-friendly) rather than drag — the same
 * capability as the original gear, without a drag dependency.
 */
export function ColumnDisplay({
  columns,
  onToggle,
  onMove,
  onReset,
}: {
  columns: ColumnMeta[];
  onToggle: (key: string, visible: boolean) => void;
  onMove: (key: string, dir: -1 | 1) => void;
  onReset: () => void;
}) {
  const { t } = useTranslation();

  const content = (
    <div style={{ width: 240 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Typography.Text strong>{t('common.columnDisplay')}</Typography.Text>
        <Button type="link" size="small" onClick={onReset} style={{ paddingInline: 0 }}>
          {t('common.reset')}
        </Button>
      </div>
      <Space direction="vertical" size={2} style={{ width: '100%' }}>
        {columns.map((col, idx) => (
          <div
            key={col.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '2px 4px',
              borderRadius: 6,
            }}
          >
            <Checkbox
              checked={col.visible}
              disabled={!col.toggleable}
              onChange={(e) => onToggle(col.key, e.target.checked)}
            >
              {col.title}
            </Checkbox>
            <Space size={0}>
              <Button
                type="text"
                size="small"
                disabled={idx === 0}
                icon={<ArrowUpOutlined style={{ fontSize: 11 }} />}
                onClick={() => onMove(col.key, -1)}
              />
              <Button
                type="text"
                size="small"
                disabled={idx === columns.length - 1}
                icon={<ArrowDownOutlined style={{ fontSize: 11 }} />}
                onClick={() => onMove(col.key, 1)}
              />
            </Space>
          </div>
        ))}
      </Space>
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <Tooltip title={t('common.columnDisplay')}>
        <Button
          type="text"
          icon={<SettingOutlined style={{ color: brand.textSecondary }} />}
        />
      </Tooltip>
    </Popover>
  );
}
