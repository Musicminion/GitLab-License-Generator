import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Card, Divider, Radio, Select, Space, Typography } from 'antd'
import {
  AppstoreOutlined,
  CloudServerOutlined,
  DownloadOutlined,
  LinuxOutlined,
} from '@ant-design/icons'
import Icon from '@ant-design/icons'
import type { ReactNode } from 'react'

// Docker whale glyph — Ant Design ships no brand icons, so we use the
// official Docker mark as a custom SVG.
const DockerSvg = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
    <path d="M13.98 11.06h2.05V9.18h-2.05v1.88zm-2.46 0h2.05V9.18h-2.05v1.88zm-2.45 0h2.04V9.18H9.07v1.88zm-2.46 0h2.05V9.18H6.61v1.88zm-2.45 0h2.04V9.18H4.16v1.88zm2.45-2.3h2.05V6.88H6.61v1.88zm2.46 0h2.04V6.88H9.07v1.88zm2.45 0h2.05V6.88h-2.05v1.88zm0-2.3h2.05V4.58h-2.05v1.88zm10.6 4.94c-.06-.05-.62-.47-1.79-.47-.31 0-.63.03-.94.09-.23-1.59-1.54-2.36-1.6-2.4l-.32-.18-.21.3c-.27.41-.46.87-.58 1.35-.22.92-.09 1.78.39 2.52-.57.32-1.5.4-1.69.4H1.36c-.4 0-.72.32-.72.72-.02 1.35.21 2.69.69 3.95.55 1.39 1.36 2.41 2.41 3.03 1.18.71 3.1 1.11 5.27 1.11.98.01 1.96-.08 2.92-.27 1.34-.25 2.62-.74 3.79-1.43.96-.59 1.83-1.32 2.57-2.17 1.24-1.42 1.98-3 2.53-4.4h.22c1.25 0 2.02-.5 2.44-.92.28-.26.49-.58.65-.93l.09-.27-.25-.13z" />
  </svg>
)
const DockerIcon = (props: object) => <Icon component={DockerSvg} {...props} />

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

const METHOD_ICONS: Record<Method, ReactNode> = {
  omnibus: <LinuxOutlined />,
  docker: <DockerIcon />,
  compose: <AppstoreOutlined />,
  helm: <CloudServerOutlined />,
}

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
          <div className="deploy-method-picker" style={{ marginTop: 8 }}>
            <Radio.Group
              value={method}
              onChange={(e) => setMethod(e.target.value as Method)}
              optionType="button"
              buttonStyle="solid"
            >
              {(['omnibus', 'docker', 'compose', 'helm'] as Method[]).map((m) => (
                <Radio.Button key={m} value={m}>
                  <Space size={6}>
                    {METHOD_ICONS[m]}
                    {t(`deploy.methods.${m}`)}
                  </Space>
                </Radio.Button>
              ))}
            </Radio.Group>
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
