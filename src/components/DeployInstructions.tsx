import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Card, Divider, Segmented, Space, Typography } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import { BUNDLED_PUBLIC_KEY_PEM } from '../crypto/keys'
import { downloadText } from '../lib/download'
import CodeBlock from './CodeBlock'

type Method = 'omnibus' | 'docker' | 'compose' | 'helm'

const KEY_PATH = '/opt/gitlab/embedded/service/gitlab-rails/.license_encryption_key.pub'

// Commands are language-neutral, so they live here rather than in the i18n files.
const COMMANDS: Record<Method, string> = {
  omnibus: `sudo cp public.key ${KEY_PATH}
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart`,
  docker: `# Re-create the GitLab container with the public key mounted in:
docker stop gitlab && docker rm gitlab
docker run --detach --name gitlab \\
  --volume "$(pwd)/public.key:${KEY_PATH}" \\
  --volume gitlab-config:/etc/gitlab \\
  --volume gitlab-logs:/var/log/gitlab \\
  --volume gitlab-data:/var/opt/gitlab \\
  gitlab/gitlab-ee:latest`,
  compose: `# docker-compose.yml — add the volume:
services:
  gitlab:
    image: gitlab/gitlab-ee:latest
    volumes:
      - "./public.key:${KEY_PATH}"

# then re-create the container:
docker compose down
docker compose up -d`,
  helm: `# 1. Store the public key in a secret:
kubectl create secret generic gitlab-license-pubkey \\
  --from-file=.license_encryption_key.pub=public.key \\
  --namespace <your-namespace>

# 2. Mount it into the webservice & sidekiq pods via values.yaml:
gitlab:
  webservice:
    extraVolumes: |
      - name: license-pubkey
        secret:
          secretName: gitlab-license-pubkey
    extraVolumeMounts: |
      - name: license-pubkey
        mountPath: ${KEY_PATH}
        subPath: .license_encryption_key.pub
  sidekiq:
    # repeat the same extraVolumes / extraVolumeMounts here

# 3. Apply the changes:
helm upgrade --install gitlab gitlab/gitlab -f values.yaml`,
}

const SERVICE_PING = `gitlab_rails['usage_ping_enabled'] = false`

const UPLOAD_URL = '<YourGitLabURL>/admin/license/new'

export default function DeployInstructions() {
  const { t } = useTranslation()
  const [method, setMethod] = useState<Method>('omnibus')

  return (
    <Card title={t('deploy.title')}>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Typography.Paragraph type="secondary">{t('deploy.intro')}</Typography.Paragraph>

        <Button
          icon={<DownloadOutlined />}
          onClick={() => downloadText('public.key', BUNDLED_PUBLIC_KEY_PEM)}
        >
          {t('deploy.downloadPublicKey')}
        </Button>

        <Divider style={{ margin: '8px 0' }} />

        <div>
          <Typography.Text strong>{t('deploy.method')}</Typography.Text>
          <div style={{ marginTop: 8 }}>
            <Segmented<Method>
              value={method}
              onChange={setMethod}
              options={(['omnibus', 'docker', 'compose', 'helm'] as Method[]).map((m) => ({
                value: m,
                label: t(`deploy.methods.${m}`),
              }))}
            />
          </div>
        </div>

        <div>
          <Typography.Title level={5}>{t('deploy.replaceTitle')}</Typography.Title>
          <Typography.Paragraph type="secondary">
            {t(`deploy.replaceDesc.${method}`)}
          </Typography.Paragraph>
          {method === 'helm' && (
            <Alert
              type="warning"
              showIcon
              style={{ marginBottom: 12 }}
              message={t('deploy.helmWarning')}
            />
          )}
          <CodeBlock content={COMMANDS[method]} variant="dark" />
        </div>

        <div>
          <Typography.Title level={5}>{t('deploy.uploadTitle')}</Typography.Title>
          <Typography.Paragraph type="secondary">
            {t('deploy.uploadDesc', { url: UPLOAD_URL })}
          </Typography.Paragraph>
        </div>

        <div>
          <Typography.Title level={5}>{t('deploy.servicePingTitle')}</Typography.Title>
          <Typography.Paragraph type="secondary">
            {t('deploy.servicePingDesc')}
          </Typography.Paragraph>
          <CodeBlock content={SERVICE_PING} variant="dark" />
        </div>

        <Alert type="info" showIcon message={t('deploy.troubleshootDesc')} />
      </Space>
    </Card>
  )
}
