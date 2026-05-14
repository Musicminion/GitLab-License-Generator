import { useState } from 'react'
import { Col, Row } from 'antd'

import LicenseForm from './LicenseForm'
import ResultPanel from './ResultPanel'
import type { GeneratedLicense } from '../crypto/license'
import type { GeneratedKeyPair } from '../crypto/keygen'

export default function GenerateTab({
  generatedKeyPair,
}: {
  generatedKeyPair: GeneratedKeyPair | null
}) {
  const [result, setResult] = useState<GeneratedLicense | null>(null)

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <LicenseForm generatedKeyPair={generatedKeyPair} onGenerated={setResult} />
      </Col>
      <Col xs={24} md={12}>
        <ResultPanel result={result} />
      </Col>
    </Row>
  )
}
