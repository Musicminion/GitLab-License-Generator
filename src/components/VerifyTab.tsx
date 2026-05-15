import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Radio,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  Upload,
} from 'antd'
import { SafetyCertificateOutlined, UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'

import { decryptLicense } from '../crypto/encryptor'
import { BUNDLED_PUBLIC_KEY_PEM } from '../crypto/keys'
import type { StoredKeyPair } from '../lib/useKeyPairs'
import CodeBlock from './CodeBlock'
import CodeEditor from './CodeEditor'

interface ParsedLicense {
  licensee?: { Name?: string; Company?: string; Email?: string }
  issued_at?: string
  expires_at?: string
  block_changes_at?: string
  restrictions?: { plan?: string; active_user_count?: number }
}

interface VerifyResult {
  json: string
  attributes: ParsedLicense
  expired: boolean
}

type KeySource = 'bundled' | 'generated' | 'custom'

export default function VerifyTab({ keyPairs }: { keyPairs: StoredKeyPair[] }) {
  const { t } = useTranslation()
  const [blob, setBlob] = useState('')
  const [keySource, setKeySource] = useState<KeySource>('bundled')
  const [keyPairId, setKeyPairId] = useState<string | undefined>()
  const [customKey, setCustomKey] = useState('')
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const publicKey = useMemo<string | null>(() => {
    if (keySource === 'bundled') return BUNDLED_PUBLIC_KEY_PEM
    if (keySource === 'custom') return customKey.trim() || null
    return keyPairs.find((kp) => kp.id === keyPairId)?.publicKeyPem ?? null
  }, [keySource, customKey, keyPairId, keyPairs])

  const onUpload: UploadProps['beforeUpload'] = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      setBlob(String(reader.result ?? '').trim())
      setResult(null)
      setError(null)
    }
    reader.readAsText(file)
    return false // never actually upload
  }

  const onVerify = () => {
    setResult(null)
    setError(null)
    if (!publicKey) return
    try {
      const plain = decryptLicense(blob, publicKey)
      const attributes = JSON.parse(plain) as ParsedLicense
      const expiresAt = attributes.expires_at
        ? new Date(`${attributes.expires_at}T00:00:00Z`)
        : null
      setResult({
        json: JSON.stringify(attributes, null, 2),
        attributes,
        expired: expiresAt ? expiresAt.getTime() < Date.now() : false,
      })
    } catch {
      setError(t('verify.decryptFailed'))
    }
  }

  const planLabel = useMemo(() => {
    const plan = result?.attributes.restrictions?.plan
    if (plan === 'ultimate' || plan === 'premium' || plan === 'starter') {
      return t(`plans.${plan}`)
    }
    return plan ?? '—'
  }, [result, t])

  return (
    <Row gutter={[16, 16]} align="stretch">
      <Col xs={24} md={12} style={{ display: 'flex' }}>
        <Card title={t('verify.title')} style={{ width: '100%' }}>
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {t('verify.intro')}
            </Typography.Paragraph>

            <div>
              <Typography.Text strong>{t('verify.inputLabel')}</Typography.Text>
              <div style={{ marginTop: 6 }}>
                <CodeEditor
                  value={blob}
                  onChange={setBlob}
                  placeholder={t('verify.inputPlaceholder')}
                  minHeight={280}
                  maxHeight={420}
                />
              </div>
              <Upload
                beforeUpload={onUpload}
                showUploadList={false}
                accept=".gitlab-license,.txt"
              >
                <Button style={{ marginTop: 8 }} icon={<UploadOutlined />}>
                  {t('verify.upload')}
                </Button>
              </Upload>
            </div>

            <div>
              <Typography.Text strong>{t('verify.keySource')}</Typography.Text>
              <div style={{ marginTop: 6 }}>
                <Radio.Group
                  value={keySource}
                  onChange={(e) => setKeySource(e.target.value as KeySource)}
                >
                  <Radio value="bundled">{t('form.keySourceBundled')}</Radio>
                  <Radio value="generated" disabled={keyPairs.length === 0}>
                    {t('form.keySourceGenerated')}
                  </Radio>
                  <Radio value="custom">{t('verify.keySourceCustom')}</Radio>
                </Radio.Group>
              </div>
              {keySource === 'generated' && keyPairs.length > 0 && (
                <Select
                  style={{ marginTop: 8, width: '100%' }}
                  value={keyPairId}
                  onChange={setKeyPairId}
                  placeholder={t('form.selectKeyPairPlaceholder')}
                  options={keyPairs.map((kp) => ({ value: kp.id, label: kp.name }))}
                />
              )}
              {keySource === 'custom' && (
                <div style={{ marginTop: 8 }}>
                  <CodeEditor
                    value={customKey}
                    onChange={setCustomKey}
                    placeholder={t('verify.customKeyPlaceholder')}
                    minHeight={140}
                    maxHeight={220}
                  />
                </div>
              )}
            </div>

            <Button
              type="primary"
              icon={<SafetyCertificateOutlined />}
              disabled={!blob.trim() || !publicKey}
              onClick={onVerify}
            >
              {t('verify.verifyButton')}
            </Button>
          </Space>
        </Card>
      </Col>

      <Col xs={24} md={12} style={{ display: 'flex' }}>
        <Card title={t('verify.resultTitle')} style={{ width: '100%' }}>
          {error ? (
            <Alert type="error" showIcon message={error} />
          ) : !result ? (
            <Empty description={t('verify.empty')} />
          ) : (
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <Alert
                type={result.expired ? 'warning' : 'success'}
                showIcon
                message={result.expired ? t('verify.okExpired') : t('verify.okActive')}
              />
              <Descriptions
                column={1}
                size="small"
                bordered
                items={[
                  {
                    key: 'status',
                    label: t('verify.status'),
                    children: (
                      <Tag color={result.expired ? 'warning' : 'success'}>
                        {result.expired ? t('verify.statusExpired') : t('verify.statusActive')}
                      </Tag>
                    ),
                  },
                  { key: 'plan', label: t('form.plan'), children: planLabel },
                  {
                    key: 'name',
                    label: t('form.name'),
                    children: result.attributes.licensee?.Name ?? '—',
                  },
                  {
                    key: 'company',
                    label: t('form.company'),
                    children: result.attributes.licensee?.Company ?? '—',
                  },
                  {
                    key: 'email',
                    label: t('form.email'),
                    children: result.attributes.licensee?.Email ?? '—',
                  },
                  {
                    key: 'issued',
                    label: t('form.startsAt'),
                    children: result.attributes.issued_at ?? '—',
                  },
                  {
                    key: 'expires',
                    label: t('form.expiresAt'),
                    children: result.attributes.expires_at ?? '—',
                  },
                  {
                    key: 'block',
                    label: t('form.blockChangesAt'),
                    children: result.attributes.block_changes_at ?? '—',
                  },
                  {
                    key: 'users',
                    label: t('form.userCount'),
                    children: String(result.attributes.restrictions?.active_user_count ?? '—'),
                  },
                ]}
              />
              <div>
                <Typography.Text strong>{t('result.jsonTab')}</Typography.Text>
                <div style={{ marginTop: 6 }}>
                  <CodeBlock content={result.json} maxHeight={320} />
                </div>
              </div>
            </Space>
          )}
        </Card>
      </Col>
    </Row>
  )
}
