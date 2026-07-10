import { useEffect, useState, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Layers,
  Spade,
  CreditCard,
  CalendarClock,
  Footprints,
  MapPin,
  Dices,
  Cpu,
  Megaphone,
  Blocks,
  Table2,
  Map,
  UserRound,
  Search,
  Plus,
  Sun,
  Moon,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { Overview } from './views/Overview';
import { Account } from './views/Account';
import { CommandPalette, type CommandItem } from './CommandPalette';
import {
  TableHeartbeatView,
  ShoeDataView,
  GameDataView,
  CardDataView,
  EventDataView,
  UserActivityView,
} from './views/enquiryViews';
import {
  PitLocationView,
  GameTypeView,
  MachineView,
  SignageGroupView,
  PitView,
  TableView,
  LocationView,
} from './views/maintenanceViews';
import { VToastProvider } from './toast';
import { IntentProvider, useIntent } from './intent';
import { NavCtx } from './nav';
import './vnext.css';

interface NavItem {
  key: string;
  label: string;
  sub: string;
  icon: LucideIcon;
  view: ComponentType;
}
interface NavGroup {
  label?: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    items: [
      { key: 'overview', label: 'Overview', sub: 'Live floor snapshot', icon: LayoutDashboard, view: Overview },
    ],
  },
  {
    label: 'Enquiry',
    items: [
      { key: 'heartbeat', label: 'Table Heartbeat', sub: 'Every table, live heartbeat', icon: Activity, view: TableHeartbeatView },
      { key: 'shoe', label: 'Shoe Data', sub: 'Shoe-level records', icon: Layers, view: ShoeDataView },
      { key: 'games', label: 'Game Data', sub: 'Recent baccarat results', icon: Spade, view: GameDataView },
      { key: 'cards', label: 'Card Data', sub: 'Card-level detail', icon: CreditCard, view: CardDataView },
      { key: 'events', label: 'Event Data', sub: 'System & table events', icon: CalendarClock, view: EventDataView },
      { key: 'activity', label: 'User Activity', sub: 'Operator audit trail', icon: Footprints, view: UserActivityView },
    ],
  },
  {
    label: 'Maintenance',
    items: [
      { key: 'pit-location', label: 'Pit Location', sub: 'Manage pit locations', icon: MapPin, view: PitLocationView },
      { key: 'game-type', label: 'Game Type', sub: 'Manage game types', icon: Dices, view: GameTypeView },
      { key: 'machine', label: 'Machine', sub: 'Manage machines', icon: Cpu, view: MachineView },
      { key: 'signage', label: 'Signage Group', sub: 'Manage signage groups', icon: Megaphone, view: SignageGroupView },
      { key: 'pit', label: 'Pit', sub: 'Manage pits', icon: Blocks, view: PitView },
      { key: 'table', label: 'Table', sub: 'Manage tables', icon: Table2, view: TableView },
      { key: 'location', label: 'Location', sub: 'Manage locations', icon: Map, view: LocationView },
    ],
  },
  {
    label: 'Account',
    items: [
      { key: 'account', label: 'My Profile', sub: 'Your account', icon: UserRound, view: Account },
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap((g) => g.items);
const MAINT_ITEMS = GROUPS.find((g) => g.label === 'Maintenance')?.items ?? [];

// Navigation entries + "New <entity>" quick actions.
const CMD_ITEMS: CommandItem[] = [
  ...GROUPS.flatMap((g) =>
    g.items.map((it) => ({ key: it.key, label: it.label, group: g.label ?? 'General', icon: it.icon })),
  ),
  ...MAINT_ITEMS.map((it) => ({
    key: `new:${it.key}`,
    label: `New ${it.label}`,
    group: 'Actions',
    icon: Plus,
  })),
];

/** Isolated clock — local state so ticking never re-renders the shell. */
function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="vn-clock mini">
      <div className="time">{now.toLocaleTimeString('en-GB', { hour12: false })}</div>
      <div className="date">
        {now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
      </div>
    </div>
  );
}

/**
 * vNext shell — "Back Office". Floating glass nav rail (grouped, all classic
 * screens) + a content panel that slides between views. Custom components +
 * dark glassmorphism; deliberately not Ant Design.
 */
export function VNext() {
  return (
    <VToastProvider>
      <IntentProvider>
        <VNextShell />
      </IntentProvider>
    </VToastProvider>
  );
}

type Theme = 'dark' | 'light';

function VNextShell() {
  const navigate = useNavigate();
  const { requestCreate } = useIntent();
  const [active, setActive] = useState('overview');
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('vn.theme') as Theme) || 'dark',
  );

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('vn.theme', next);
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const current = ALL_ITEMS.find((n) => n.key === active) ?? ALL_ITEMS[0];
  const View = current.view;

  // ⌘K / Ctrl+K toggles the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdkOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Palette selection: plain keys navigate; "new:<key>" jumps + opens create.
  const onSelect = (key: string) => {
    if (key.startsWith('new:')) {
      const viewKey = key.slice(4);
      setActive(viewKey);
      requestCreate(viewKey);
    } else {
      setActive(key);
    }
    setCmdkOpen(false);
  };

  return (
    <NavCtx.Provider value={setActive}>
      <CommandPalette
        open={cmdkOpen}
        items={CMD_ITEMS}
        onSelect={onSelect}
        onClose={() => setCmdkOpen(false)}
      />
      <div className="vn-app" data-theme={theme}>
        <div className="vn-bg">
          <div className="vn-orb a" />
          <div className="vn-orb b" />
          <div className="vn-orb c" />
        </div>
        <div className="vn-watermark" />
        <div className="vn-grain" />

        {/* Floating nav rail */}
        <nav className="vn-rail">
          <div className="vn-rail-brand">
            <img src={`${import.meta.env.BASE_URL}mgm-logo.svg`} alt="MGM" />
            <div style={{ flex: 1 }}>
              <p className="sub">MGM · BSB</p>
              <h1>Back Office</h1>
            </div>
            <button
              className="vn-icon-btn"
              onClick={toggleTheme}
              aria-label="toggle theme"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          <button className="vn-cmdk-trigger" onClick={() => setCmdkOpen(true)}>
            <Search size={15} /> <span>Search…</span> <span className="vn-kbd">⌘K</span>
          </button>

          <div className="vn-nav">
            {GROUPS.map((group, gi) => (
              <div key={gi}>
                {group.label && <div className="vn-nav-group-label">{group.label}</div>}
                {group.items.map((n) => {
                  const Icon = n.icon;
                  const isActive = n.key === active;
                  return (
                    <button
                      key={n.key}
                      className={`vn-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => setActive(n.key)}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="vnNavPill"
                          className="vn-nav-pill"
                          transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                        />
                      )}
                      <span className="ic">
                        <Icon size={17} />
                      </span>
                      <span>{n.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="vn-rail-foot">
            <div
              className="vn-user click"
              onClick={() => setActive('account')}
              role="button"
            >
              <span className="av">QA</span>
              <div>
                <div className="nm">QATG003</div>
                <div className="rl">Supervisor</div>
              </div>
            </div>
            <button className="vn-back" onClick={() => navigate('/app/enquiry/table-heartbeat')}>
              <LogOut size={15} /> <span>Classic view</span>
            </button>
          </div>
        </nav>

        {/* Sliding content panel (keyed remount replays the entrance slide) */}
        <section className="vn-panel">
          <motion.div
            key={active}
            className="vn-view"
            initial={{ opacity: 0, x: 42 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="vn-view-head">
              <div>
                <h2>{current.label}</h2>
                <p className="sub">{current.sub}</p>
              </div>
              <Clock />
            </div>
            <View />
          </motion.div>
        </section>
      </div>
    </NavCtx.Provider>
  );
}
