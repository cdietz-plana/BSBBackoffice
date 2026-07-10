import { useMemo, useState, type Key } from 'react';
import { App, Button, Space, Switch, Popconfirm, Tooltip } from 'antd';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/table/DataTable';
import type { DataColumn } from '@/components/table/types';
import { EmptyState } from '@/components/StateViews';
import { EntityFormModal } from './EntityFormModal';
import type { EntityConfig, FieldConfig } from './fieldConfig';

/**
 * Full CRUD surface for one Maintenance entity, driven entirely by its
 * EntityConfig. Columns AND the create/edit form both come from `config.fields`,
 * so every entity reuses this exact pattern. All mutations are local (mock) and
 * fire a toast; add/edit/delete are UI-only per the reskin scope.
 */
export function CrudTable<T extends object>({
  config,
}: {
  config: EntityConfig<T>;
}) {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [rows, setRows] = useState<T[]>(() => config.seed());
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<T | null>(null);

  const rowKey = config.rowKey;
  const singular = t(config.singularKey);

  /** Toggle the Enabled switch inline. */
  const toggleEnabled = (record: T, next: boolean) => {
    setRows((prev) =>
      prev.map((r) => (r[rowKey] === record[rowKey] ? { ...r, enabled: next } : r)),
    );
    message.success(t('common.statusUpdated'));
  };

  const deleteKeys = (keys: Key[]) => {
    setRows((prev) => prev.filter((r) => !keys.includes(r[rowKey] as Key)));
    message.success(t('common.deletedN', { count: keys.length }));
  };

  /** Build table columns from the field config (+ inline switch + Actions). */
  const columns = useMemo<DataColumn<T>[]>(() => {
    const optionLabel = (field: FieldConfig, value: unknown) => {
      const opt = field.options?.find((o) => o.value === value);
      return opt ? (opt.labelKey ? t(opt.labelKey) : opt.label ?? opt.value) : String(value ?? '—');
    };

    const dataCols: DataColumn<T>[] = config.fields
      .filter((f) => !f.hideInTable)
      .map((field) => {
        const base: DataColumn<T> = {
          title: t(field.labelKey),
          dataIndex: field.name as keyof T & string,
          sortable: true,
        };
        if (field.type === 'switch') {
          return {
            ...base,
            width: 130,
            render: (value: unknown, record: T) => (
              <Switch
                size="small"
                checked={Boolean(value)}
                onChange={(next) => toggleEnabled(record, next)}
              />
            ),
          };
        }
        if (field.type === 'select') {
          return { ...base, render: (value: unknown) => optionLabel(field, value) };
        }
        return { ...base, searchable: field.searchable ?? field.type === 'text' };
      });

    const actionsCol: DataColumn<T> = {
      title: t('common.actions'),
      dataIndex: '__actions' as keyof T & string,
      enableToggle: false,
      width: 100,
      fixed: 'right',
      render: (_: unknown, record: T) => (
        <Space size={2}>
          <Tooltip title={t('common.edit')}>
            <Button
              type="text"
              size="small"
              icon={<Pencil size={15} />}
              onClick={() => {
                setMode('edit');
                setEditing(record);
                setModalOpen(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title={t('common.deleteOneConfirm')}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            onConfirm={() => deleteKeys([record[rowKey] as Key])}
          >
            <Tooltip title={t('common.delete')}>
              <Button type="text" size="small" danger icon={<Trash2 size={15} />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    };

    return [...dataCols, actionsCol];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.fields, t]);

  const openCreate = () => {
    setMode('create');
    setEditing(null);
    setModalOpen(true);
  };

  const handleSubmit = (values: Partial<T>) => {
    if (mode === 'create') {
      const id = `${config.key}-${rows.length + 1}-${Date.now()}`;
      const newRow = { [rowKey]: id, ...values } as unknown as T;
      setRows((prev) => [newRow, ...prev]);
      message.success(t('common.created', { name: singular }));
    } else if (editing) {
      setRows((prev) =>
        prev.map((r) => (r[rowKey] === editing[rowKey] ? { ...r, ...values } : r)),
      );
      message.success(t('common.updated', { name: singular }));
    }
    setModalOpen(false);
  };

  const checkDuplicate = (values: Partial<T>): string | null => {
    if (!config.uniqueField) return null;
    const field = config.uniqueField;
    const val = (values as Record<string, unknown>)[field];
    const clash = rows.some(
      (r) => r[field] === val && (!editing || r[rowKey] !== editing[rowKey]),
    );
    return clash ? String(field) : null;
  };

  const refresh = () => {
    setLoading(true);
    window.setTimeout(() => {
      setRows(config.seed());
      setLoading(false);
      message.success(t('common.refresh'));
    }, 500);
  };

  return (
    <>
      <DataTable<T>
        columns={columns}
        data={rows}
        rowKey={rowKey}
        loading={loading}
        showAdd
        showDelete
        showRefresh
        onAdd={openCreate}
        onDeleteSelected={deleteKeys}
        onRefresh={refresh}
        emptyText={
          <EmptyState
            title={t('states.emptyTitle', { name: singular })}
            hint={t('states.emptyHint')}
            onCreate={openCreate}
            createLabel={`${t('common.add')} · ${singular}`}
          />
        }
      />

      <EntityFormModal<T>
        open={modalOpen}
        mode={mode}
        singularKey={config.singularKey}
        fields={config.fields}
        initialValues={editing ?? undefined}
        checkDuplicate={checkDuplicate}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
