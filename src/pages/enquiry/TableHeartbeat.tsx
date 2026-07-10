import { useMemo, useState } from 'react';
import { Row, Col, Typography } from 'antd';
import { Pie } from '@ant-design/plots';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/PageHeader';
import { ContentCard } from '@/components/ContentCard';
import { FilterBar, type FilterField, type FilterValues } from '@/components/FilterBar';
import { DataTable } from '@/components/table/DataTable';
import type { DataColumn } from '@/components/table/types';
import {
  makeHeartbeatData,
  PIT_OPTIONS,
  TABLE_OPTIONS,
  MACHINE_OPTIONS,
  type HeartbeatRow,
} from '@/data/enquiry';
import { brand } from '@/theme/theme';

const { Text } = Typography;

/** The one dashboard screen — Timeout vs Alive pie + status table. */
export function TableHeartbeat() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<HeartbeatRow[]>(() => makeHeartbeatData());

  const stats = useMemo(() => {
    const timeout = rows.filter((r) => r.status === 'Timeout').length;
    const alive = rows.length - timeout;
    return [
      { type: t('heartbeat.timeout'), value: timeout },
      { type: t('heartbeat.alive'), value: alive },
    ];
  }, [rows, t]);

  const pieConfig = {
    data: stats,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    height: 300,
    scale: {
      color: { range: [brand.chartTimeout, brand.chartAlive] },
    },
    label: {
      text: (d: { value: number }) =>
        `${((d.value / rows.length) * 100).toFixed(1)}%`,
      position: 'inside',
      style: { fill: '#fff', fontWeight: 600 },
    },
    legend: {
      color: { position: 'bottom', layout: { justifyContent: 'center' } },
    },
  };

  const columns: DataColumn<HeartbeatRow>[] = [
    { title: t('fields.pitName'), dataIndex: 'pitName', searchable: true, sortable: true },
    { title: t('fields.tableName'), dataIndex: 'tableName', searchable: true, sortable: true },
    { title: t('fields.machineName'), dataIndex: 'machineName', searchable: true, sortable: true },
    { title: t('fields.lastReceiveDate'), dataIndex: 'lastReceiveDate', sortable: true },
    {
      title: t('fields.status'),
      dataIndex: 'status',
      sortable: true,
      width: 120,
      render: (value: unknown) => {
        const timeout = value === 'Timeout';
        return (
          <span style={{ color: timeout ? brand.chartTimeout : brand.chartAlive, fontWeight: 500 }}>
            {timeout ? t('heartbeat.timeout') : t('heartbeat.alive')}
          </span>
        );
      },
    },
  ];

  const filters: FilterField[] = [
    { key: 'pit', labelKey: 'fields.pitName', type: 'select', options: PIT_OPTIONS },
    { key: 'table', labelKey: 'fields.tableName', type: 'select', options: TABLE_OPTIONS },
    { key: 'machine', labelKey: 'fields.machineName', type: 'select', options: MACHINE_OPTIONS },
    {
      key: 'status',
      labelKey: 'fields.status',
      type: 'select',
      span: 8,
      options: [
        { value: 'Timeout', labelKey: 'heartbeat.timeout' },
        { value: 'Alive', labelKey: 'heartbeat.alive' },
      ],
    },
  ];

  const onSearch = (values: FilterValues) => {
    const status = values.status as string | undefined;
    const all = makeHeartbeatData();
    setRows(status ? all.filter((r) => r.status === status) : all);
  };

  return (
    <>
      <PageHeader groupKey="nav.enquiry" titleKey="nav.tableHeartbeat" />
      <FilterBar fields={filters} onSearch={onSearch} />
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <ContentCard>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              {t('heartbeat.distribution')}
            </Text>
            <Pie {...pieConfig} />
          </ContentCard>
        </Col>
        <Col xs={24} lg={16}>
          <ContentCard>
            <DataTable<HeartbeatRow>
              columns={columns}
              data={rows}
              rowKey="id"
              showRowSelection={false}
              showRefresh
              showExport
              onRefresh={() => setRows(makeHeartbeatData())}
              defaultPageSize={10}
            />
          </ContentCard>
        </Col>
      </Row>
    </>
  );
}
