import { useTranslation } from 'react-i18next'
import { Alert, Button, Card, Empty, Space, Tabs, Typography } from 'antd'
import { ClearOutlined, DownloadOutlined } from '@ant-design/icons'

import type { GeneratedLicense } from '../crypto/license'
import { downloadText } from '../lib/download'
import CodeBlock from './CodeBlock'

interface ResultPanelProps {
  result: GeneratedLicense | null
  onClear: () => void
}

export default function ResultPanel({ result, onClear }: ResultPanelProps) {
  const { t } = useTranslation()

  return (
    <Card title={t('result.title')} style={{ width: '100%' }}>
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
                children: <CodeBlock content={result.json} maxHeight={420} />,
              },
              {
                key: 'blob',
                label: t('result.blobTab'),
                children: (
                  <>
                    <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
                      {t('result.blobHint')}
                    </Typography.Paragraph>
                    <CodeBlock content={result.blob} maxHeight={520} />
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
            <Button icon={<ClearOutlined />} onClick={onClear}>
              {t('result.clear')}
            </Button>
          </Space>
        </Space>
      )}
    </Card>
  )
}
