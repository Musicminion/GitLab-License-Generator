import { useTranslation } from 'react-i18next'
import { ConfigProvider, Tabs, Typography } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import frFR from 'antd/locale/fr_FR'
import ruRU from 'antd/locale/ru_RU'
import type { Locale } from 'antd/es/locale'

import LangSwitcher from './components/LangSwitcher'
import GenerateTab from './components/GenerateTab'
import DeployInstructions from './components/DeployInstructions'
import KeyPairPanel from './components/KeyPairPanel'
import { useKeyPairs } from './lib/useKeyPairs'

const ANTD_LOCALES: Record<string, Locale> = {
  en: enUS,
  zh: zhCN,
  fr: frFR,
  ru: ruRU,
}

export default function App() {
  const { t, i18n } = useTranslation()
  const keyStore = useKeyPairs()

  return (
    <ConfigProvider
      locale={ANTD_LOCALES[i18n.language] ?? enUS}
      theme={{
        token: {
          colorPrimary: '#ff6fa5',
          colorInfo: '#ff6fa5',
          colorLink: '#ff4f93',
          colorSuccess: '#ff9ec4',
          // Keep warning alerts in the same pink as the primary buttons,
          // with a soft tint + border so they still read against the pink page.
          colorWarning: '#ff6fa5',
          colorWarningBg: '#ffe3ee',
          colorWarningBorder: '#ffb3d0',
          borderRadius: 12,
        },
        components: {
          Card: { borderRadiusLG: 18 },
          Button: { borderRadius: 999 },
          Segmented: { borderRadius: 999, itemSelectedBg: '#ff6fa5', itemSelectedColor: '#fff' },
          Tabs: { itemSelectedColor: '#ff4f93', inkBarColor: '#ff6fa5' },
        },
      }}
    >
      <div className="app-shell">
        <header className="app-header">
          <div className="app-brand">
            <img
              className="app-logo"
              src={`${import.meta.env.BASE_URL}logo.svg`}
              width={56}
              height={56}
              alt=""
            />
            <div>
              <Typography.Title level={2} style={{ marginBottom: 4 }}>
                {t('app.title')}
              </Typography.Title>
              <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                {t('app.subtitle')}
              </Typography.Paragraph>
            </div>
          </div>
          <LangSwitcher />
        </header>

        <Tabs
          defaultActiveKey="generate"
          size="large"
          items={[
            {
              key: 'generate',
              label: t('tabs.generate'),
              children: <GenerateTab keyPairs={keyStore.keyPairs} />,
            },
            {
              key: 'deploy',
              label: t('tabs.deploy'),
              children: <DeployInstructions />,
            },
            {
              key: 'keys',
              label: t('tabs.keys'),
              children: <KeyPairPanel store={keyStore} />,
            },
          ]}
        />

        <Typography.Paragraph type="secondary" style={{ marginTop: 32, textAlign: 'center' }}>
          {t('app.disclaimer')}
          <br />
          {t('app.footer')}
        </Typography.Paragraph>
      </div>
    </ConfigProvider>
  )
}
