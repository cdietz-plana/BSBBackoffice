import { Layout } from 'antd';
import { useTranslation } from 'react-i18next';
import { brand, layout } from '@/theme/theme';

const { Footer } = Layout;

const BACKEND_VERSION = '1.3.11';
const FRONTEND_VERSION = '1.3.11';

export function AppFooter() {
  const { t } = useTranslation();
  return (
    <Footer
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: layout.footerHeight,
        paddingBlock: 0,
        fontSize: 12,
        color: brand.textSecondary,
        borderTop: `1px solid ${brand.border}`,
      }}
    >
      <span>{t('footer.copyright')}</span>
      <span>{t('footer.version', { be: BACKEND_VERSION, fe: FRONTEND_VERSION })}</span>
    </Footer>
  );
}
