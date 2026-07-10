import type { ReactNode } from 'react';
import { brand } from '@/theme/theme';

/** Frosted-glass surface that content sits on (blur + translucency in `.glass`). */
export function ContentCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="glass"
      style={{
        borderRadius: 12,
        padding: 16,
        boxShadow: '0 8px 30px rgba(31, 27, 22, 0.06)',
      }}
    >
      {children}
    </div>
  );
}

/** Renders the boolean Enabled column as a subtle gold/grey tag-dot. */
export function EnabledCell({ value }: { value: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        color: value ? brand.success : brand.textSecondary,
        fontSize: 13,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: value ? brand.success : '#CDC7BB',
          display: 'inline-block',
        }}
      />
      {value ? '✓' : '—'}
    </span>
  );
}
