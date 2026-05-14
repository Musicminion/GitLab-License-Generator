import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Tooltip, message } from 'antd'
import { CheckOutlined, CopyOutlined } from '@ant-design/icons'

interface CodeBlockProps {
  content: string
  /** `dark` for shell commands, `light` for keys / JSON. */
  variant?: 'dark' | 'light'
  /** Optional max height (px) before the block scrolls. */
  maxHeight?: number
}

/** A monospace block with line numbers and a built-in copy-to-clipboard button. */
export default function CodeBlock({ content, variant = 'light', maxHeight }: CodeBlockProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    void navigator.clipboard.writeText(content).then(
      () => {
        setCopied(true)
        message.success(t('common.copied'))
        window.setTimeout(() => setCopied(false), 1500)
      },
      () => undefined,
    )
  }

  // Drop trailing blank lines so PEM blocks don't show an empty numbered row.
  const lines = content.replace(/\n+$/, '').split('\n')

  return (
    <div className="code-wrap">
      <pre
        className={variant === 'dark' ? 'code-block' : 'key-block'}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {lines.map((line, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span className="code-line" key={i}>
            <span className="code-line-no">{i + 1}</span>
            <span className="code-line-text">{line || ' '}</span>
          </span>
        ))}
      </pre>
      <Tooltip title={copied ? t('common.copied') : t('common.copy')}>
        <Button
          className="code-copy-btn"
          size="small"
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          onClick={copy}
        />
      </Tooltip>
    </div>
  )
}
