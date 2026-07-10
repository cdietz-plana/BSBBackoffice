import { Button, Typography } from 'antd';
import type { ReactNode } from 'react';
import { Inbox, SearchX, MousePointerClick } from 'lucide-react';
import { brand } from '@/theme/theme';

const { Title, Text } = Typography;

interface StateViewProps {
  icon: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
}

/** Centered illustration + copy used for empty / no-results / prompt states. */
export function StateView({ icon, title, hint, action }: StateViewProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '48px 16px',
        textAlign: 'center',
      }}
    >
      <div style={{ color: brand.gold, opacity: 0.75, marginBottom: 4 }}>{icon}</div>
      <Title level={5} style={{ margin: 0 }}>
        {title}
      </Title>
      {hint && (
        <Text type="secondary" style={{ maxWidth: 360 }}>
          {hint}
        </Text>
      )}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  );
}

/** "No records yet" — offers a create affordance. */
export function EmptyState({ title, hint, onCreate, createLabel }: {
  title: string;
  hint?: string;
  onCreate?: () => void;
  createLabel?: string;
}) {
  return (
    <StateView
      icon={<Inbox size={44} strokeWidth={1.5} />}
      title={title}
      hint={hint}
      action={
        onCreate ? (
          <Button type="primary" onClick={onCreate}>
            {createLabel}
          </Button>
        ) : undefined
      }
    />
  );
}

/** "No results" — for filtered enquiry views. */
export function NoResults({ title, hint }: { title: string; hint?: string }) {
  return <StateView icon={<SearchX size={44} strokeWidth={1.5} />} title={title} hint={hint} />;
}

/** "Run a search" — shown before the first enquiry query. */
export function SearchPrompt({ title }: { title: string }) {
  return <StateView icon={<MousePointerClick size={44} strokeWidth={1.5} />} title={title} />;
}
