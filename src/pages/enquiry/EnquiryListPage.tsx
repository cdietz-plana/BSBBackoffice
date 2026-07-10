import { useState, type ReactNode } from 'react';
import { App as AntApp, Drawer } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/PageHeader';
import { ContentCard } from '@/components/ContentCard';
import { FilterBar, type FilterField, type FilterValues } from '@/components/FilterBar';
import { DataTable } from '@/components/table/DataTable';
import { TableSkeleton } from '@/components/table/TableSkeleton';
import { NoResults } from '@/components/StateViews';
import type { DataColumn } from '@/components/table/types';

export interface EnquiryConfig<T> {
  titleKey: string;
  filters: FilterField[];
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: keyof T & string;
  /** For heavy-pagination demos (Card Data). */
  totalOverride?: number;
  defaultPageSize?: number;
  /** Base filename for CSV export. */
  exportFileName?: string;
  /** Client-side filter mapping filter values → row predicate (UI-only mock). */
  filterFn?: (row: T, values: FilterValues) => boolean;
  /** Expandable drill-in detail panel for a row. */
  renderDetail?: (row: T) => ReactNode;
}

/**
 * One template for every read-only Enquiry page: filter bar → search (with a
 * loading skeleton) → results table with export, or a no-results state. Rows
 * can expand into a detail panel and/or expose a per-row print action.
 * Filtering is client-side over mock data.
 */
export function EnquiryListPage<T extends object>({
  config,
}: {
  config: EnquiryConfig<T>;
}) {
  const { t } = useTranslation();
  const { message } = AntApp.useApp();
  const [loading, setLoading] = useState(false);
  const [displayed, setDisplayed] = useState<T[]>(config.rows);
  const [detailRow, setDetailRow] = useState<T | null>(null);

  const runSearch = (values: FilterValues) => {
    setLoading(true);
    // Simulate a fetch so the skeleton is visible.
    window.setTimeout(() => {
      const next = config.filterFn
        ? config.rows.filter((r) => config.filterFn!(r, values))
        : config.rows;
      setDisplayed(next);
      setLoading(false);
      message.success(t('common.search'));
    }, 500);
  };

  return (
    <>
      <PageHeader groupKey="nav.enquiry" titleKey={config.titleKey} />
      <FilterBar fields={config.filters} onSearch={runSearch} />
      <ContentCard>
        {loading ? (
          <TableSkeleton />
        ) : (
          <DataTable<T>
            columns={config.columns}
            data={displayed}
            rowKey={config.rowKey}
            showRowSelection={false}
            showRefresh
            showExport
            exportFileName={config.exportFileName ?? config.titleKey}
            onRefresh={() => runSearch({})}
            totalOverride={config.totalOverride}
            defaultPageSize={config.defaultPageSize ?? 20}
            onRowClick={config.renderDetail ? (r) => setDetailRow(r) : undefined}
            emptyText={
              <NoResults
                title={t('states.noResultsTitle')}
                hint={t('states.noResultsHint')}
              />
            }
          />
        )}
      </ContentCard>

      {/* Row drill-in: a right-hand detail drawer (opened by clicking a row). */}
      {config.renderDetail && (
        <Drawer
          title={t('common.detail')}
          placement="right"
          width={440}
          open={detailRow !== null}
          onClose={() => setDetailRow(null)}
          destroyOnHidden
        >
          {detailRow && config.renderDetail(detailRow)}
        </Drawer>
      )}
    </>
  );
}
