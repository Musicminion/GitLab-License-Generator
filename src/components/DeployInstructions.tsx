import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Card, Divider, Radio, Segmented, Select, Space, Typography } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import { BUNDLED_PUBLIC_KEY_PEM } from '../crypto/keys'
import { downloadText } from '../lib/download'
import type { StoredKeyPair } from '../lib/useKeyPairs'
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

export default function DeployInstructions({ keyPairs }: { keyPairs: StoredKeyPair[] }) {
  const { t } = useTranslation()
  const [method, setMethod] = useState<Method>('omnibus')
  const [keySource, setKeySource] = useState<'bundled' | 'generated'>('bundled')
  const [keyPairId, setKeyPairId] = useState<string | undefined>()

  // Which public key the user should install into GitLab — it must match the
  // private key the license was signed with.
  const publicKey = useMemo<string | null>(() => {
    if (keySource === 'bundled') return BUNDLED_PUBLIC_KEY_PEM
    return keyPairs.find((kp) => kp.id === keyPairId)?.publicKeyPem ?? null
  }, [keySource, keyPairId, keyPairs])

  return (
    <Card title={t('deploy.title')}>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Typography.Paragraph type="secondary">{t('deploy.intro')}</Typography.Paragraph>

        <div>
          <Typography.Text strong>{t('deploy.keyToInstall')}</Typography.Text>
          <div style={{ marginTop: 6 }}>
            <Radio.Group
              value={keySource}
              onChange={(e) => setKeySource(e.target.value as 'bundled' | 'generated')}
            >
              <Radio value="bundled">{t('form.keySourceBundled')}</Radio>
              <Radio value="generated" disabled={keyPairs.length === 0}>
                {t('form.keySourceGenerated')}
              </Radio>
            </Radio.Group>
          </div>
          {keySource === 'generated' && keyPairs.length > 0 && (
            <Select
              style={{ marginTop: 8, width: '100%', maxWidth: 320 }}
              value={keyPairId}
              onChange={setKeyPairId}
              placeholder={t('form.selectKeyPairPlaceholder')}
              options={keyPairs.map((kp) => ({ value: kp.id, label: kp.name }))}
            />
          )}
        </div>

        <Button
          icon={<DownloadOutlined />}
          disabled={!publicKey}
          onClick={() => publicKey && downloadText('public.key', publicKey)}
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
            {t('deploy.uploadDesc')}
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
