import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Card, Collapse, Empty, List, Popconfirm, Space, Typography, message } from 'antd'
import { DeleteOutlined, DownloadOutlined, KeyOutlined } from '@ant-design/icons'

import { generateKeyPair } from '../crypto/keygen'
import { BUNDLED_PUBLIC_KEY_PEM } from '../crypto/keys'
import { downloadText } from '../lib/download'
import type { KeyPairStore } from '../lib/useKeyPairs'
import CodeBlock from './CodeBlock'

export default function KeyPairPanel({ store }: { store: KeyPairStore }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const keyPair = await generateKeyPair()
      store.addKeyPair(keyPair)
      message.success(t('keys.generatedSuccess'))
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
              children: <CodeBlock content={BUNDLED_PUBLIC_KEY_PEM} />,
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
        <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
          {t('keys.savedHint')}
        </Typography.Paragraph>
      </Card>

      <Card title={`${t('keys.listTitle')} (${store.keyPairs.length})`}>
        {store.keyPairs.length === 0 ? (
          <Empty description={t('keys.empty')} />
        ) : (
          <List
            dataSource={[...store.keyPairs].reverse()}
            renderItem={(kp) => (
              <List.Item key={kp.id}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Typography.Text
                      strong
                      editable={{ onChange: (value) => store.renameKeyPair(kp.id, value) }}
                    >
                      {kp.name}
                    </Typography.Text>
                    <Space>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(kp.createdAt).toLocaleString()}
                      </Typography.Text>
                      <Popconfirm
                        title={t('keys.deleteConfirm')}
                        onConfirm={() => store.removeKeyPair(kp.id)}
                      >
                        <Button size="small" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  </div>
                  <Collapse
                    size="small"
                    items={[
                      {
                        key: 'public',
                        label: t('keys.publicKey'),
                        children: (
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <CodeBlock content={kp.publicKeyPem} />
                            <Button
                              size="small"
                              icon={<DownloadOutlined />}
                              onClick={() => downloadText('public.key', kp.publicKeyPem)}
                            >
                              {t('keys.downloadPublic')}
                            </Button>
                          </Space>
                        ),
                      },
                      {
                        key: 'private',
                        label: t('keys.privateKey'),
                        children: (
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <CodeBlock content={kp.privateKeyPem} />
                            <Button
                              size="small"
                              icon={<DownloadOutlined />}
                              onClick={() => downloadText('private.key', kp.privateKeyPem)}
                            >
                              {t('keys.downloadPrivate')}
                            </Button>
                          </Space>
                        ),
                      },
                    ]}
                  />
                </Space>
              </List.Item>
            )}
          />
        )}
      </Card>
    </Space>
  )
}
