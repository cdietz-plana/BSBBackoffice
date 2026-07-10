import { useMemo } from 'react';
import { Button, Space } from 'antd';
import { PrinterOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MgmLogo } from '@/components/MgmLogo';
import { pick, resetSeed } from '@/data/helpers';
import './ScoreCard.css';

type Outcome = 'player' | 'banker' | 'tie';

/** Generate a mock baccarat shoe as a list of outcomes. */
function useMockShoe(): Outcome[] {
  return useMemo(() => {
    resetSeed(777);
    return Array.from(
      { length: 54 },
      () => pick<Outcome>(['player', 'banker', 'banker', 'player', 'tie']),
    );
  }, []);
}

/** Bead plate: fills top-to-bottom, then next column. */
function BeadPlate({ shoe }: { shoe: Outcome[] }) {
  return (
    <div className="sc-grid bead-plate">
      {shoe.map((o, i) => (
        <div className="sc-cell" key={i}>
          <span className={`sc-bead ${o}`}>{o === 'player' ? 'P' : o === 'banker' ? 'B' : 'T'}</span>
        </div>
      ))}
    </div>
  );
}

/** Big road: rings, coloured by player/banker (ties skipped for the mock). */
function BigRoad({ shoe }: { shoe: Outcome[] }) {
  const rings = shoe.filter((o) => o !== 'tie');
  return (
    <div className="sc-grid big-road">
      {rings.map((o, i) => (
        <div className="sc-cell" key={i}>
          <span className={`sc-ring ${o}`} />
        </div>
      ))}
    </div>
  );
}

/**
 * Score Card — print-friendly baccarat scorecard with MGM branding.
 * Roadmaps are mock/static. The "provided as a service only" disclaimer and
 * @media print CSS match the production artifact.
 */
export function ScoreCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const shoe = useMockShoe();

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="sc-toolbar no-print">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            {t('common.close')}
          </Button>
          <Button type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
            {t('scorecard.print')}
          </Button>
        </Space>
      </div>

      <div className="sc-page">
        <div className="sc-title">
          <span className="zh">{t('scorecard.titleZh')}</span>
          <span>{t('scorecard.title')}</span>
        </div>

        <BigRoad shoe={shoe} />
        <BeadPlate shoe={shoe} />

        <hr className="sc-divider" />

        <div className="sc-footer">
          <div>
            <div className="sc-meta">
              <span>{t('scorecard.tableNumber')} : CTBB03</span>
              <span>{t('scorecard.shoeStart')} : 2025/11/21 AM 12:43:51</span>
              <span>{t('scorecard.printedAt')} : 2025/11/21 PM 04:47:31</span>
              <span>{t('scorecard.lastGame')} : 2025/11/21 PM 04:25:56</span>
            </div>
            <div className="sc-disclaimer">
              {t('scorecard.disclaimer1')}
              <br />
              {t('scorecard.disclaimer2')}
            </div>
          </div>
          <div className="sc-logo">
            <MgmLogo size={110} />
          </div>
        </div>
      </div>
    </div>
  );
}
