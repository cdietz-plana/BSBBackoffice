import { useState } from 'react';
import { Row, Col, Select, DatePicker, Input, Button, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs, { type Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

export interface SelectOption {
  value: string;
  labelKey?: string;
  label?: string;
}

export type FilterFieldType = 'select' | 'input' | 'dateRange';

export interface FilterField {
  key: string;
  labelKey: string;
  type: FilterFieldType;
  options?: SelectOption[];
  /** Column span (of 24) on desktop. Defaults to 8 (three-up). */
  span?: number;
}

export type FilterValues = Record<string, unknown>;

/** Date-range presets from the original app: Past 3 / 6 / 9 / 12 months. */
function useRangePresets() {
  const { t } = useTranslation();
  const now = dayjs();
  return [
    { label: t('filter.past3m'), value: [now.subtract(3, 'month'), now] as [Dayjs, Dayjs] },
    { label: t('filter.past6m'), value: [now.subtract(6, 'month'), now] as [Dayjs, Dayjs] },
    { label: t('filter.past9m'), value: [now.subtract(9, 'month'), now] as [Dayjs, Dayjs] },
    { label: t('filter.past12m'), value: [now.subtract(12, 'month'), now] as [Dayjs, Dayjs] },
  ];
}

/**
 * Labeled filter row used by every Enquiry page. Config-driven: pass a list of
 * fields and it renders selects / inputs / a preset date-range picker, plus the
 * Search button. Layout is a responsive grid so it survives EN↔繁中 label swaps.
 */
export function FilterBar({
  fields,
  onSearch,
  defaultValues,
}: {
  fields: FilterField[];
  onSearch: (values: FilterValues) => void;
  defaultValues?: FilterValues;
}) {
  const { t } = useTranslation();
  const presets = useRangePresets();
  const [values, setValues] = useState<FilterValues>(defaultValues ?? {});

  const setField = (key: string, value: unknown) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'select':
        return (
          <Select
            allowClear
            style={{ width: '100%' }}
            placeholder={t('common.selectPlaceholder')}
            value={values[field.key] as string | undefined}
            onChange={(v) => setField(field.key, v)}
            options={(field.options ?? []).map((o) => ({
              value: o.value,
              label: o.labelKey ? t(o.labelKey) : o.label ?? o.value,
            }))}
          />
        );
      case 'dateRange':
        return (
          <RangePicker
            style={{ width: '100%' }}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            presets={presets}
            value={values[field.key] as [Dayjs, Dayjs] | undefined}
            onChange={(v) => setField(field.key, v)}
          />
        );
      case 'input':
      default:
        return (
          <Input
            allowClear
            style={{ width: '100%' }}
            value={values[field.key] as string | undefined}
            onChange={(e) => setField(field.key, e.target.value)}
          />
        );
    }
  };

  return (
    <div
      className="glass"
      style={{
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        boxShadow: '0 8px 30px rgba(31, 27, 22, 0.06)',
      }}
    >
      <Row gutter={[16, 12]} align="bottom">
        {fields.map((field) => (
          <Col key={field.key} xs={24} sm={12} lg={field.span ?? 8}>
            <Text
              type="secondary"
              style={{ display: 'block', marginBottom: 4, fontSize: 13 }}
            >
              {t(field.labelKey)}
            </Text>
            {renderField(field)}
          </Col>
        ))}
        <Col xs={24} lg={4} style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => onSearch(values)}
            style={{ minWidth: 96 }}
          >
            {t('common.search')}
          </Button>
        </Col>
      </Row>
    </div>
  );
}
