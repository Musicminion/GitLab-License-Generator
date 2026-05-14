// Port of the license-building logic from `lib/license.rb` and
// `src/generator.license.rb` in the original Ruby project.
import { encryptLicense } from './encryptor'

export type LicensePlan = 'ultimate' | 'premium' | 'starter'

export const LICENSE_PLANS: LicensePlan[] = ['ultimate', 'premium', 'starter']

/** Raw form input collected from the UI. Dates are `YYYY-MM-DD` strings. */
export interface LicenseFormValues {
  name: string
  company: string
  email: string
  plan: LicensePlan
  userCount: number
  /** issued_at / starts_at */
  startsAt: string
  expiresAt: string
  blockChangesAt: string
}

/** The decrypted license payload, matching GitLab's expected JSON shape. */
export interface LicenseAttributes {
  version: number
  licensee: { Name: string; Company: string; Email: string }
  issued_at: string
  expires_at: string
  block_changes_at: string
  cloud_licensing_enabled: boolean
  offline_cloud_licensing_enabled: boolean
  auto_renew_enabled: boolean
  seat_reconciliation_enabled: boolean
  operational_metrics_enabled: boolean
  generated_from_customers_dot: boolean
  generated_from_cancellation: boolean
  restrictions: { plan: LicensePlan; active_user_count: number }
}

/** Defaults mirror `src/generator.license.rb`. */
export const DEFAULT_FORM: LicenseFormValues = {
  name: 'Tim Cook',
  company: 'Apple Computer, Inc.',
  email: 'tcook@apple.com',
  plan: 'ultimate',
  userCount: 2147483647,
  startsAt: '1976-04-01',
  expiresAt: '2500-04-01',
  blockChangesAt: '2500-04-01',
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function isValidDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
}

/**
 * Validate the form, returning a map of field -> i18n error key.
 * Combines `Gitlab::License#valid?` (lib/license.rb:91-119) with the extra
 * guard rails from `src/generator.license.rb`.
 */
export function validateForm(form: LicenseFormValues): Partial<Record<keyof LicenseFormValues, string>> {
  const errors: Partial<Record<keyof LicenseFormValues, string>> = {}

  if (!form.name.trim()) errors.name = 'errors.required'
  if (!form.company.trim()) errors.company = 'errors.required'
  if (!form.email.trim()) errors.email = 'errors.required'

  if (!LICENSE_PLANS.includes(form.plan)) errors.plan = 'errors.invalidPlan'

  if (!Number.isInteger(form.userCount) || form.userCount < 1) {
    errors.userCount = 'errors.minUserCount'
  }

  if (!isValidDate(form.startsAt)) errors.startsAt = 'errors.invalidDate'
  if (!isValidDate(form.expiresAt)) {
    errors.expiresAt = 'errors.invalidDate'
  } else if (new Date(`${form.expiresAt}T00:00:00Z`).getTime() < Date.now()) {
    // generator.license.rb rejects an expiry year before the current year.
    errors.expiresAt = 'errors.expiryInPast'
  }
  if (!isValidDate(form.blockChangesAt)) errors.blockChangesAt = 'errors.invalidDate'

  return errors
}

/**
 * Build the license attributes object. Key order matches `lib/license.rb`'s
 * `#attributes` so the serialized JSON lines up with the Ruby tool's output.
 */
export function buildAttributes(form: LicenseFormValues): LicenseAttributes {
  return {
    version: 1,
    licensee: {
      Name: form.name,
      Company: form.company,
      Email: form.email,
    },
    issued_at: form.startsAt,
    expires_at: form.expiresAt,
    block_changes_at: form.blockChangesAt,
    cloud_licensing_enabled: true,
    offline_cloud_licensing_enabled: true,
    auto_renew_enabled: false,
    seat_reconciliation_enabled: false,
    operational_metrics_enabled: false,
    generated_from_customers_dot: false,
    generated_from_cancellation: false,
    restrictions: {
      plan: form.plan,
      active_user_count: form.userCount,
    },
  }
}

export interface GeneratedLicense {
  /** The `.gitlab-license` file contents. */
  blob: string
  /** Pretty-printed plaintext JSON, for preview. */
  json: string
  attributes: LicenseAttributes
}

/** Build, serialize and encrypt a license in one step. */
export function generateLicense(form: LicenseFormValues, privateKeyPem: string): GeneratedLicense {
  const attributes = buildAttributes(form)
  // Ruby's `JSON.dump` emits compact JSON — match it for the encrypted payload.
  const compact = JSON.stringify(attributes)
  return {
    blob: encryptLicense(compact, privateKeyPem),
    json: JSON.stringify(attributes, null, 2),
    attributes,
  }
}
