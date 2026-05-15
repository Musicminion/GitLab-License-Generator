import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Button,
  Card,
  Collapse,
  Empty,
  Input,
  List,
  Popconfirm,
  Space,
  Typography,
  Upload,
  message,
} from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  ImportOutlined,
  KeyOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import type { UploadProps } from 'antd'

import { generateKeyPair, importKeyPair } from '../crypto/keygen'
import CodeEditor from './CodeEditor'
import { BUNDLED_PUBLIC_KEY_PEM } from '../crypto/keys'
import { downloadText } from '../lib/download'
import type { KeyPairStore } from '../lib/useKeyPairs'
import CodeBlock from './CodeBlock'

export default function KeyPairPanel({ store }: { store: KeyPairStore }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [importPrivate, setImportPrivate] = useState('')
  const [importPublic, setImportPublic] = useState('')
  const [importName, setImportName] = useState('')

  const onUploadPem = (set: (v: string) => void): UploadProps['beforeUpload'] => (file) => {
    const reader = new FileReader()
    reader.onload = () => set(String(reader.result ?? '').trim())
    reader.readAsText(file)
    return false
  }

  const handleImport = () => {
    if (!importPrivate.trim()) {
      message.error(t('keys.importPrivateRequired'))
      return
    }
    try {
      const pair = importKeyPair(importPrivate, importPublic)
      store.addKeyPair(pair, importName.trim() || t('keys.importedName'))
      setImportPrivate('')
      setImportPublic('')
      setImportName('')
      message.success(t('keys.importSuccess'))
    } catch (err) {
      const code = err instanceof Error ? err.message : ''
      const key = ['invalidPrivate', 'invalidPublic', 'keyMismatch'].includes(code)
        ? `keys.import_${code}`
        : 'keys.importFailed'
      message.error(t(key))
    }
  }

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

      <Card title={t('keys.importTitle')}>
        <Typography.Paragraph type="secondary">{t('keys.importIntro')}</Typography.Paragraph>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <div>
            <Typography.Text strong>{t('keys.importPublicLabel')}</Typography.Text>
            <Typography.Text type="secondary" style={{ marginLeft: 6, fontSize: 12 }}>
              {t('keys.importPublicHint')}
            </Typography.Text>
            <div style={{ marginTop: 6 }}>
              <CodeEditor
                value={importPublic}
                onChange={setImportPublic}
                placeholder={t('keys.importPublicPlaceholder')}
                minHeight={140}
                maxHeight={220}
              />
            </div>
            <Upload beforeUpload={onUploadPem(setImportPublic)} showUploadList={false} accept=".key,.pem,.txt">
              <Button size="small" style={{ marginTop: 6 }} icon={<UploadOutlined />}>
                {t('keys.importUploadFile')}
              </Button>
            </Upload>
          </div>
          <div>
            <Typography.Text strong>{t('keys.importPrivateLabel')}</Typography.Text>
            <div style={{ marginTop: 6 }}>
              <CodeEditor
                value={importPrivate}
                onChange={setImportPrivate}
                placeholder={t('keys.importPrivatePlaceholder')}
                minHeight={160}
                maxHeight={260}
              />
            </div>
            <Upload beforeUpload={onUploadPem(setImportPrivate)} showUploadList={false} accept=".key,.pem,.txt">
              <Button size="small" style={{ marginTop: 6 }} icon={<UploadOutlined />}>
                {t('keys.importUploadFile')}
              </Button>
            </Upload>
          </div>
          <div>
            <Typography.Text strong>{t('keys.importNameLabel')}</Typography.Text>
            <Input
              style={{ marginTop: 6 }}
              value={importName}
              onChange={(e) => setImportName(e.target.value)}
              placeholder={t('keys.importNamePlaceholder')}
            />
          </div>
          <Button type="primary" icon={<ImportOutlined />} onClick={handleImport}>
            {t('keys.importButton')}
          </Button>
        </Space>
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
