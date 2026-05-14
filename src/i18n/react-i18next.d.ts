import 'react-i18next'
import type en from './locales/en'

// Make the `t()` function aware of our translation keys.
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof en
    }
  }
}
