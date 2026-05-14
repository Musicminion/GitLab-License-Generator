import { useTranslation } from 'react-i18next'
import { Button, Card, DatePicker, Form, Input, InputNumber, Radio, Select, Space, message } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'

import {
  DEFAULT_FORM,
  LICENSE_PLANS,
  generateLicense,
  type GeneratedLicense,
  type LicensePlan,
} from '../crypto/license'
import { BUNDLED_PRIVATE_KEY_PEM } from '../crypto/keys'
import type { StoredKeyPair } from '../lib/useKeyPairs'

interface FormFields {
  name: string
  company: string
  email: string
  plan: LicensePlan
  userCount: number
  startsAt: Dayjs
  expiresAt: Dayjs
  blockChangesAt: Dayjs
  keySource: 'bundled' | 'generated'
  keyPairId?: string
}

const initialValues = (): FormFields => ({
  name: DEFAULT_FORM.name,
  company: DEFAULT_FORM.company,
  email: DEFAULT_FORM.email,
  plan: DEFAULT_FORM.plan,
  userCount: DEFAULT_FORM.userCount,
  // Default the issue date to today rather than the original Ruby tool's
  // hard-coded 1976-04-01.
  startsAt: dayjs(),
  expiresAt: dayjs(DEFAULT_FORM.expiresAt),
  blockChangesAt: dayjs(DEFAULT_FORM.blockChangesAt),
  keySource: 'bundled',
  keyPairId: undefined,
})

interface LicenseFormProps {
  keyPairs: StoredKeyPair[]
  onGenerated: (result: GeneratedLicense) => void
}

export default function LicenseForm({ keyPairs, onGenerated }: LicenseFormProps) {
  const { t } = useTranslation()
  const [form] = Form.useForm<FormFields>()
  const keySource = Form.useWatch('keySource', form)

  const onFinish = (values: FormFields) => {
    try {
      let privateKeyPem = BUNDLED_PRIVATE_KEY_PEM
      if (values.keySource === 'generated') {
        const pair = keyPairs.find((kp) => kp.id === values.keyPairId)
        if (!pair) {
          message.error(t('errors.noGeneratedKey'))
          return
        }
        privateKeyPem = pair.privateKeyPem
      }

      const result = generateLicense(
        {
          name: values.name,
          company: values.company,
          email: values.email,
          plan: values.plan,
          userCount: values.userCount,
          startsAt: values.startsAt.format('YYYY-MM-DD'),
          expiresAt: values.expiresAt.format('YYYY-MM-DD'),
          blockChangesAt: values.blockChangesAt.format('YYYY-MM-DD'),
        },
        privateKeyPem,
      )
      onGenerated(result)
    } catch (err) {
      message.error(
        t('errors.generateFailed', {
          message: err instanceof Error ? err.message : String(err),
        }),
      )
    }
  }

  return (
    <Card title={t('form.title')} style={{ width: '100%' }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues()}
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Form.Item
          name="name"
          label={t('form.name')}
          rules={[{ required: true, message: t('errors.required') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="company"
          label={t('form.company')}
          rules={[{ required: true, message: t('errors.required') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label={t('form.email')}
          rules={[
            { required: true, message: t('errors.required') },
            { type: 'email', message: t('errors.required') },
          ]}
        >
          <Input />
        </Form.Item>

        <Space size="large" style={{ display: 'flex' }} align="start">
          <Form.Item
            name="plan"
            label={t('form.plan')}
            style={{ flex: 1 }}
            rules={[{ required: true, message: t('errors.required') }]}
          >
            <Select
              options={LICENSE_PLANS.map((plan) => ({
                value: plan,
                label: t(`plans.${plan}`),
              }))}
            />
          </Form.Item>

          <Form.Item
            name="userCount"
            label={t('form.userCount')}
            style={{ flex: 1 }}
            rules={[{ required: true, message: t('errors.minUserCount') }]}
          >
            <InputNumber min={1} step={1} precision={0} style={{ width: '100%' }} />
          </Form.Item>
        </Space>

        <Form.Item
          name="startsAt"
          label={t('form.startsAt')}
          rules={[{ required: true, message: t('errors.invalidDate') }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="expiresAt"
          label={t('form.expiresAt')}
          rules={[
            { required: true, message: t('errors.invalidDate') },
            {
              validator: (_rule, value: Dayjs) =>
                value && value.isAfter(dayjs())
                  ? Promise.resolve()
                  : Promise.reject(new Error(t('errors.expiryInPast'))),
            },
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="blockChangesAt"
          label={t('form.blockChangesAt')}
          rules={[{ required: true, message: t('errors.invalidDate') }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="keySource" label={t('form.keySource')} style={{ marginBottom: 8 }}>
          <Radio.Group>
            <Radio value="bundled">{t('form.keySourceBundled')}</Radio>
            <Radio value="generated" disabled={keyPairs.length === 0}>
              {t('form.keySourceGenerated')}
            </Radio>
          </Radio.Group>
        </Form.Item>

        {keySource === 'generated' &&
          (keyPairs.length === 0 ? (
            <Form.Item>
              <span style={{ color: '#999', fontSize: 12 }}>
                {t('form.keySourceGeneratedHint')}
              </span>
            </Form.Item>
          ) : (
            <Form.Item
              name="keyPairId"
              label={t('form.selectKeyPair')}
              rules={[{ required: true, message: t('errors.noGeneratedKey') }]}
            >
              <Select
                placeholder={t('form.selectKeyPairPlaceholder')}
                options={keyPairs.map((kp) => ({ value: kp.id, label: kp.name }))}
              />
            </Form.Item>
          ))}

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              {t('form.generate')}
            </Button>
            <Button htmlType="button" onClick={() => form.resetFields()}>
              {t('form.reset')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}
