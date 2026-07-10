import { Modal, Form, InputNumber, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { App as AntApp } from 'antd';

const { Text } = Typography;

export interface ExportValues {
  skipRows?: number | null;
  limitRows?: number | null;
}

export interface ExportColumn {
  key: string;
  title: string;
}

/**
 * Export modal — mirrors the original app: Skip Rows / Limit Rows / Save.
 * "Save" generates a CSV of the current rows (honouring skip/limit) and triggers
 * a real browser download — a believable mock of the production export.
 */
export function ExportModal<T extends object>({
  open,
  rows = [],
  columns = [],
  fileName,
  onClose,
}: {
  open: boolean;
  rows?: T[];
  columns?: ExportColumn[];
  fileName: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { message } = AntApp.useApp();
  const [form] = Form.useForm<ExportValues>();

  const totalRows = rows.length;

  const buildCsv = (skip: number, limit: number): string => {
    const slice = rows.slice(skip, skip + limit);
    const escape = (v: unknown) => {
      const s = String(v ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = columns.map((c) => escape(c.title)).join(',');
    const body = slice
      .map((row) =>
        columns.map((c) => escape((row as Record<string, unknown>)[c.key])).join(','),
      )
      .join('\n');
    return `${header}\n${body}`;
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const skip = values.skipRows ?? 0;
    const limit = values.limitRows ?? totalRows;
    const csv = buildCsv(skip, Math.max(0, limit));

    // Trigger a real download of the generated CSV.
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const count = Math.max(0, Math.min(totalRows - skip, limit));
    message.success(`${t('common.export')}: ${count} / ${totalRows}`);
    onClose();
  };

  return (
    <Modal
      title={t('exportModal.title')}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      width={420}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
        <Form.Item label={t('exportModal.skipRows')} name="skipRows">
          <InputNumber min={0} max={totalRows} style={{ width: '100%' }} placeholder="0" />
        </Form.Item>
        <Form.Item label={t('exportModal.limitRows')} name="limitRows">
          <InputNumber
            min={1}
            max={totalRows}
            style={{ width: '100%' }}
            placeholder={String(totalRows)}
          />
        </Form.Item>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('exportModal.hint')}
        </Text>
      </Form>
    </Modal>
  );
}
