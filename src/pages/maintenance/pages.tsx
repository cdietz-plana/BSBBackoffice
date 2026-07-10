import { PageHeader } from '@/components/PageHeader';
import { ContentCard } from '@/components/ContentCard';
import { CrudTable } from '@/components/crud/CrudTable';
import type { EntityConfig } from '@/components/crud/fieldConfig';
import {
  pitLocationConfig,
  gameTypeConfig,
  machineConfig,
  pitConfig,
  tableConfig,
  signageGroupConfig,
  locationConfig,
} from './entities';

/** Every Maintenance page is this same shell + a CrudTable driven by its config. */
function MaintenancePage<T extends object>({
  config,
}: {
  config: EntityConfig<T>;
}) {
  return (
    <>
      <PageHeader groupKey="nav.maintenance" titleKey={config.titleKey} />
      <ContentCard>
        <CrudTable<T> config={config} />
      </ContentCard>
    </>
  );
}

export const PitLocationPage = () => <MaintenancePage config={pitLocationConfig} />;
export const GameTypePage = () => <MaintenancePage config={gameTypeConfig} />;
export const MachinePage = () => <MaintenancePage config={machineConfig} />;
export const PitPage = () => <MaintenancePage config={pitConfig} />;
export const TablePage = () => <MaintenancePage config={tableConfig} />;
export const SignageGroupPage = () => <MaintenancePage config={signageGroupConfig} />;
export const LocationPage = () => <MaintenancePage config={locationConfig} />;
