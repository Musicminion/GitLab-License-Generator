import { useEffect, useState } from 'react'
import { Col, Row } from 'antd'

import LicenseForm from './LicenseForm'
import ResultPanel from './ResultPanel'
import type { GeneratedLicense } from '../crypto/license'
import type { StoredKeyPair } from '../lib/useKeyPairs'

const STORAGE_KEY = 'gllg-result'

function loadResult(): GeneratedLicense | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      parsed &&
      typeof (parsed as GeneratedLicense).blob === 'string' &&
      typeof (parsed as GeneratedLicense).json === 'string'
    ) {
      return parsed as GeneratedLicense
    }
    return null
  } catch {
    return null
  }
}

export default function GenerateTab({ keyPairs }: { keyPairs: StoredKeyPair[] }) {
  // The last generated license is kept in localStorage so it survives a reload.
  const [result, setResult] = useState<GeneratedLicense | null>(loadResult)

  useEffect(() => {
    try {
      if (result) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // localStorage may be unavailable (private mode / quota) — non-fatal.
    }
  }, [result])

  return (
    <Row gutter={[16, 16]} align="stretch">
      <Col xs={24} md={12} style={{ display: 'flex' }}>
        <LicenseForm keyPairs={keyPairs} onGenerated={setResult} />
      </Col>
      <Col xs={24} md={12} style={{ display: 'flex' }}>
        <ResultPanel result={result} onClear={() => setResult(null)} />
      </Col>
    </Row>
  )
}
