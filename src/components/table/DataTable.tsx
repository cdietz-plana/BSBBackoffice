import { useMemo, useState, type Key, type ReactNode } from 'react';
import {
  Table,
  Button,
  Space,
  Dropdown,
  Input,
  Tooltip,
  Popconfirm,
  Typography,
} from 'antd';
import type { MenuProps, TableProps, InputRef } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownloadOutlined,
  ColumnHeightOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnType } from 'antd/es/table';
import type { DataColumn, Density } from './types';
import { ColumnDisplay, type ColumnMeta } from './ColumnDisplay';
import { ExportModal } from './ExportModal';
import { brand } from '@/theme/theme';

export interface DataTableProps<T> {
  columns: DataColumn<T>[];
  data: T[];
  rowKey: keyof T & string;
  loading?: boolean;
  /** Toolbar toggles — enable only what a page needs. */
  showAdd?: boolean;
  showDelete?: boolean;
  showRefresh?: boolean;
  showExport?: boolean;
  showRowSelection?: boolean;
  /** Handlers (UI-only in the prototype). */
  onAdd?: () => void;
  onDeleteSelected?: (keys: Key[]) => void;
  onRefresh?: () => void;
  /** Extra toolbar content rendered to the left of the action icons. */
  toolbarExtra?: ReactNode;
  /** Fixed page size options. */
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  /** Server-ish total for heavy-pagination demos (Card Data). */
  totalOverride?: number;
  /** Custom empty state (empty list vs. no search results). */
  emptyText?: ReactNode;
  /** Expandable-row config for drill-in detail panels. */
  expandable?: TableProps<T>['expandable'];
  /** Row click handler — used to open the drill-in detail drawer. */
  onRowClick?: (record: T) => void;
  /** Hide the toolbar entirely (e.g. when the page renders its own). */
  hideToolbar?: boolean;
  /** Base filename for the mock CSV export (no extension). */
  exportFileName?: string;
}

const { Text } = Typography;

/**
 * Generic list table used by every Maintenance and Enquiry page. Wraps the
 * Ant Design Table with the toolbar the original BSB app exposes:
 * add · delete · refresh · export · density · column-display, plus per-column
 * search, row selection and a page-size selector.
 */
export function DataTable<T extends object>({
  columns,
  data,
  rowKey,
  loading,
  showAdd,
  showDelete,
  showRefresh = true,
  showExport,
  showRowSelection = true,
  onAdd,
  onDeleteSelected,
  onRefresh,
  toolbarExtra,
  pageSizeOptions = [10, 20, 50, 100],
  defaultPageSize = 20,
  totalOverride,
  emptyText,
  expandable,
  onRowClick,
  hideToolbar,
  exportFileName = 'export',
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [density, setDensity] = useState<Density>('middle');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [exportOpen, setExportOpen] = useState(false);
  const searchInputRef = useRef<InputRef>(null);

  // Column order + visibility state, driven by the Column Display gear.
  const [colState, setColState] = useState<ColumnMeta[]>(() =>
    columns.map((c) => ({
      key: c.dataIndex,
      title: String(c.title ?? c.dataIndex),
      visible: true,
      toggleable: c.enableToggle !== false,
    })),
  );

  /** Per-column search popover, wired from the `searchable` flag. */
  const getSearchProps = (col: DataColumn<T>): Partial<ColumnType<T>> => {
    if (!col.searchable) return {};
    return {
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? brand.gold : undefined }} />
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, width: 220 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInputRef}
            placeholder={t('common.searchPlaceholder')}
            value={selectedKeys[0] as string}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
            allowClear
          />
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<SearchOutlined />}
              onClick={() => confirm()}
            >
              {t('common.search')}
            </Button>
            <Button
              size="small"
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
            >
              {t('common.reset')}
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        String((record as Record<string, unknown>)[col.dataIndex] ?? '')
          .toLowerCase()
          .includes(String(value).toLowerCase()),
      filterDropdownProps: {
        onOpenChange: (open: boolean) => {
          if (open) setTimeout(() => searchInputRef.current?.select(), 80);
        },
      },
    };
  };

  /** Compose antd columns from config + search/sort, honouring order & visibility. */
  const antdColumns = useMemo<ColumnType<T>[]>(() => {
    const byKey = new Map<string, DataColumn<T>>(columns.map((c) => [c.dataIndex, c]));
    return colState
      .filter((meta) => meta.visible)
      .map((meta) => byKey.get(meta.key))
      .filter((c): c is DataColumn<T> => Boolean(c))
      .map((col) => {
        const { searchable, sortable, enableToggle, ...rest } = col;
        return {
          ...rest,
          ...(sortable
            ? {
                sorter: (a: T, b: T) => {
                  const av = a[col.dataIndex];
                  const bv = b[col.dataIndex];
                  if (typeof av === 'number' && typeof bv === 'number') return av - bv;
                  return String(av ?? '').localeCompare(String(bv ?? ''));
                },
              }
            : {}),
          ...getSearchProps(col),
        } as ColumnType<T>;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, colState, t]);

  const densityMenu: MenuProps = {
    selectable: true,
    selectedKeys: [density],
    onClick: ({ key }) => setDensity(key as Density),
    items: [
      { key: 'large', label: t('common.densityLarger') },
      { key: 'middle', label: t('common.densityMiddle') },
      { key: 'small', label: t('common.densityCompact') },
    ],
  };

  const moveColumn = (key: string, dir: -1 | 1) => {
    setColState((prev) => {
      const idx = prev.findIndex((c) => c.key === key);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  };

  const resetColumns = () =>
    setColState(
      columns.map((c) => ({
        key: c.dataIndex,
        title: String(c.title ?? c.dataIndex),
        visible: true,
        toggleable: c.enableToggle !== false,
      })),
    );

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: hideToolbar ? 'none' : 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <Space size={8} wrap>
          {toolbarExtra}
          {showRowSelection && selectedRowKeys.length > 0 && (
            <Text type="secondary" style={{ fontSize: 13 }}>
              {t('common.itemsSelected', { count: selectedRowKeys.length })}
            </Text>
          )}
        </Space>

        <Space size={4}>
          {showAdd && (
            <Tooltip title={t('common.add')}>
              <Button type="text" icon={<PlusOutlined />} onClick={onAdd} />
            </Tooltip>
          )}
          {showDelete && (
            <Popconfirm
              title={t('common.deleteConfirm', { count: selectedRowKeys.length })}
              disabled={selectedRowKeys.length === 0}
              onConfirm={() => {
                onDeleteSelected?.(selectedRowKeys);
                setSelectedRowKeys([]);
              }}
              okText={t('common.yes')}
              cancelText={t('common.no')}
            >
              <Tooltip title={t('common.delete')}>
                <Button
                  type="text"
                  danger
                  disabled={selectedRowKeys.length === 0}
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          )}
          {showRefresh && (
            <Tooltip title={t('common.refresh')}>
              <Button type="text" icon={<ReloadOutlined />} onClick={onRefresh} />
            </Tooltip>
          )}
          {showExport && (
            <Tooltip title={t('common.export')}>
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => setExportOpen(true)}
              />
            </Tooltip>
          )}
          <Dropdown menu={densityMenu} trigger={['click']} placement="bottomRight">
            <Tooltip title={t('common.density')}>
              <Button type="text" icon={<ColumnHeightOutlined />} />
            </Tooltip>
          </Dropdown>
          <ColumnDisplay
            columns={colState}
            onToggle={(key, visible) =>
              setColState((prev) =>
                prev.map((c) => (c.key === key ? { ...c, visible } : c)),
              )
            }
            onMove={moveColumn}
            onReset={resetColumns}
          />
        </Space>
      </div>

      <Table<T>
        rowKey={rowKey}
        columns={antdColumns}
        dataSource={data}
        loading={loading}
        size={density}
        scroll={{ x: 'max-content' }}
        expandable={expandable}
        onRow={
          onRowClick
            ? (record) => ({
                onClick: () => onRowClick(record),
                style: { cursor: 'pointer' },
              })
            : undefined
        }
        locale={emptyText ? { emptyText } : undefined}
        rowSelection={
          showRowSelection
            ? {
                selectedRowKeys,
                onChange: (keys) => setSelectedRowKeys(keys),
              }
            : undefined
        }
        pagination={
          {
            defaultPageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions.map(String),
            showTotal: (tot, range) =>
              t('pagination.total', { start: range[0], end: range[1], total: tot }),
            ...(totalOverride ? { total: totalOverride } : {}),
          } as TableProps<T>['pagination']
        }
      />

      <ExportModal<T>
        open={exportOpen}
        rows={data}
        columns={columns
          .filter((c) => c.enableToggle !== false)
          .map((c) => ({ key: c.dataIndex, title: String(c.title ?? c.dataIndex) }))}
        fileName={exportFileName}
        onClose={() => setExportOpen(false)}
      />
    </div>
  );
}
