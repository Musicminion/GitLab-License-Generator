import { useTranslation } from 'react-i18next'
import { Select } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'

import { SUPPORTED_LANGUAGES } from '../i18n'

export default function LangSwitcher() {
  const { i18n } = useTranslation()

  return (
    <Select
      aria-label="language"
      value={i18n.language}
      onChange={(value) => void i18n.changeLanguage(value)}
      suffixIcon={<GlobalOutlined />}
      style={{ minWidth: 130 }}
      options={SUPPORTED_LANGUAGES.map((lang) => ({ value: lang.code, label: lang.label }))}
    />
  )
}
