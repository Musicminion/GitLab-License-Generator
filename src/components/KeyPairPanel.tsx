import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Card, Collapse, Space, Typography, message } from 'antd'
import { DownloadOutlined, KeyOutlined } from '@ant-design/icons'

import { generateKeyPair, type GeneratedKeyPair } from '../crypto/keygen'
import { BUNDLED_PUBLIC_KEY_PEM } from '../crypto/keys'
import { downloadText } from '../lib/download'

interface KeyPairPanelProps {
  generatedKeyPair: GeneratedKeyPair | null
  onGenerated: (keyPair: GeneratedKeyPair) => void
}

export default function KeyPairPanel({ generatedKeyPair, onGenerated }: KeyPairPanelProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const keyPair = await generateKeyPair()
      onGenerated(keyPair)
    } catch (err) {
      message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Alert type="warning" showIcon message={t('keys.warning')} />

      <Card title={t('keys.bundledTitle')}>
        <Typography.Paragraph type="secondary">{t('keys.bundledIntro')}</Typography.Paragraph>
        <Collapse
          items={[
            {
              key: 'public',
              label: t('keys.showPublic'),
              children: <pre className="key-block">{BUNDLED_PUBLIC_KEY_PEM}</pre>,
            },
          ]}
        />
        <Button
          style={{ marginTop: 12 }}
          icon={<DownloadOutlined />}
          onClick={() => downloadText('public.key', BUNDLED_PUBLIC_KEY_PEM)}
        >
          {t('keys.downloadPublic')}
        </Button>
      </Card>

      <Card title={t('keys.generateTitle')}>
        <Typography.Paragraph type="secondary">{t('keys.generateIntro')}</Typography.Paragraph>
        <Button
          type="primary"
          icon={<KeyOutlined />}
          loading={loading}
          onClick={() => void handleGenerate()}
        >
          {loading ? t('keys.generating') : t('keys.generateButton')}
        </Button>

        {generatedKeyPair && (
          <Space direction="vertical" size="middle" style={{ display: 'flex', marginTop: 16 }}>
            <Alert type="success" showIcon message={t('keys.inUse')} />

            <div>
              <Typography.Text strong>{t('keys.publicKey')}</Typography.Text>
              <pre className="key-block">{generatedKeyPair.publicKeyPem}</pre>
              <Button
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => downloadText('public.key', generatedKeyPair.publicKeyPem)}
              >
                {t('keys.downloadPublic')}
              </Button>
            </div>

            <div>
              <Typography.Text strong>{t('keys.privateKey')}</Typography.Text>
              <pre className="key-block">{generatedKeyPair.privateKeyPem}</pre>
              <Button
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => downloadText('private.key', generatedKeyPair.privateKeyPem)}
              >
                {t('keys.downloadPrivate')}
              </Button>
            </div>
          </Space>
        )}
      </Card>
    </Space>
  )
}
