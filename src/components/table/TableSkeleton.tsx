import { Skeleton } from 'antd';

/** Row-shaped loading placeholder shown while an enquiry search is in flight. */
export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div style={{ padding: '4px 0' }}>
      <Skeleton.Input active block style={{ height: 40, marginBottom: 10, opacity: 0.7 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton.Input
          key={i}
          active
          block
          style={{ height: 44, marginBottom: 6, opacity: 0.5 }}
        />
      ))}
    </div>
  );
}
