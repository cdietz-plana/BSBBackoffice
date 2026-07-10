import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import enUS from 'antd/locale/en_US';
import zhTW from 'antd/locale/zh_TW';
import { useTranslation } from 'react-i18next';
import { buildTheme, FONT_SCALES, type FontScaleKey } from './theme';

/**
 * Bridges app-wide UI settings (font scale from the header's A·A·A control,
 * the edit-mode pen toggle) into Ant Design's ConfigProvider. Rebuilding the
 * theme with a new base fontSize rescales the whole UI through tokens.
 */
interface UiSettings {
  fontScale: FontScaleKey;
  setFontScale: (key: FontScaleKey) => void;
  editMode: boolean;
  toggleEditMode: () => void;
}

const UiSettingsContext = createContext<UiSettings | null>(null);

export function useUiSettings(): UiSettings {
  const ctx = useContext(UiSettingsContext);
  if (!ctx) throw new Error('useUiSettings must be used within ThemeProvider');
  return ctx;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [fontScale, setFontScale] = useState<FontScaleKey>('default');
  const [editMode, setEditMode] = useState(false);

  const settings = useMemo<UiSettings>(
    () => ({
      fontScale,
      setFontScale,
      editMode,
      toggleEditMode: () => setEditMode((v) => !v),
    }),
    [fontScale, editMode],
  );

  const themeConfig = useMemo(
    () => buildTheme(FONT_SCALES[fontScale]),
    [fontScale],
  );

  const antdLocale = i18n.language === 'zh-TW' ? zhTW : enUS;

  return (
    <UiSettingsContext.Provider value={settings}>
      <ConfigProvider theme={themeConfig} locale={antdLocale}>
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </UiSettingsContext.Provider>
  );
}
