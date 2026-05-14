import { useState } from 'react'
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
import type { GeneratedKeyPair } from './crypto/keygen'

const ANTD_LOCALES: Record<string, Locale> = {
  en: enUS,
  zh: zhCN,
  fr: frFR,
  ru: ruRU,
}

export default function App() {
  const { t, i18n } = useTranslation()
  const [generatedKeyPair, setGeneratedKeyPair] = useState<GeneratedKeyPair | null>(null)

  return (
    <ConfigProvider
      locale={ANTD_LOCALES[i18n.language] ?? enUS}
      theme={{ token: { colorPrimary: '#1677ff' } }}
    >
      <div className="app-shell">
        <header className="app-header">
          <div>
            <Typography.Title level={2} style={{ marginBottom: 4 }}>
              {t('app.title')}
            </Typography.Title>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {t('app.subtitle')}
            </Typography.Paragraph>
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
              children: <GenerateTab generatedKeyPair={generatedKeyPair} />,
            },
            {
              key: 'deploy',
              label: t('tabs.deploy'),
              children: <DeployInstructions />,
            },
            {
              key: 'keys',
              label: t('tabs.keys'),
              children: (
                <KeyPairPanel
                  generatedKeyPair={generatedKeyPair}
                  onGenerated={setGeneratedKeyPair}
                />
              ),
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
