import { useTranslation } from 'react-i18next'
import { Alert, Button, Card, Empty, Space, Tabs, Typography, message } from 'antd'
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons'

import type { GeneratedLicense } from '../crypto/license'
import { downloadText } from '../lib/download'

export default function ResultPanel({ result }: { result: GeneratedLicense | null }) {
  const { t } = useTranslation()

  const copy = (text: string) => {
    void navigator.clipboard.writeText(text).then(
      () => message.success(t('result.copied')),
      () => undefined,
    )
  }

  return (
    <Card title={t('result.title')}>
      {!result ? (
        <Empty description={t('result.empty')} />
      ) : (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Alert type="success" showIcon message={t('result.verified')} />
          <Tabs
            items={[
              {
                key: 'json',
                label: t('result.jsonTab'),
                children: <pre className="key-block">{result.json}</pre>,
              },
              {
                key: 'blob',
                label: t('result.blobTab'),
                children: (
                  <>
                    <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
                      {t('result.blobHint')}
                    </Typography.Paragraph>
                    <pre className="key-block">{result.blob}</pre>
                  </>
                ),
              },
            ]}
          />
          <Space wrap>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => downloadText('result.gitlab-license', result.blob)}
            >
              {t('result.download')}
            </Button>
            <Button icon={<CopyOutlined />} onClick={() => copy(result.blob)}>
              {t('result.blobTab')}
            </Button>
            <Button icon={<CopyOutlined />} onClick={() => copy(result.json)}>
              {t('result.jsonTab')}
            </Button>
          </Space>
        </Space>
      )}
    </Card>
  )
}
