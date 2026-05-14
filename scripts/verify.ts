/**
 * Crypto parity check: confirm the TypeScript port produces licenses that are
 * byte-for-byte compatible with the original Ruby `gitlab-license` logic.
 *
 * Run with: npm run verify
 *
 * Requires the legacy Ruby `lib/` directory and a local `ruby` interpreter to
 * be present (they are kept until this check passes, per the refactor plan).
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { decryptLicense } from '../src/crypto/encryptor'
import { DEFAULT_FORM, generateLicense } from '../src/crypto/license'

const root = fileURLToPath(new URL('..', import.meta.url))
const privateKeyPem = readFileSync(join(root, 'keys/private.key'), 'utf8')
const publicKeyPem = readFileSync(join(root, 'keys/public.key'), 'utf8')

let failures = 0
function check(name: string, ok: boolean, detail = '') {
  if (ok) {
    console.log(`  ✓ ${name}`)
  } else {
    failures++
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

console.log('1. Loopback (TS encrypt → TS decrypt)')
const generated = generateLicense(DEFAULT_FORM, privateKeyPem)
const roundTripped = decryptLicense(generated.blob, publicKeyPem)
const compact = JSON.stringify(generated.attributes)
check('decrypted plaintext matches the encrypted JSON', roundTripped === compact,
  `got ${roundTripped.slice(0, 80)}…`)

console.log('2. TS decrypts a Ruby-generated license')
const rubyLicensePath = join(root, 'build/result.gitlab-license')
if (existsSync(rubyLicensePath)) {
  try {
    const decrypted = decryptLicense(readFileSync(rubyLicensePath, 'utf8'), publicKeyPem)
    const parsed = JSON.parse(decrypted)
    check('Ruby output decrypts to valid license JSON', parsed.version === 1 && !!parsed.licensee)
  } catch (err) {
    check('Ruby output decrypts to valid license JSON', false, String(err))
  }
} else {
  console.log('  – skipped (build/result.gitlab-license not present)')
}

console.log('3. Ruby decrypts a TS-generated license')
if (existsSync(join(root, 'lib/license/encryptor.rb'))) {
  const tmp = mkdtempSync(join(tmpdir(), 'gllg-'))
  const blobPath = join(tmp, 'ts.gitlab-license')
  writeFileSync(blobPath, generated.blob)
  const rubyScript = `
    require 'base64'
    require 'json'
    require 'openssl'
    require './lib/license/encryptor'
    pub = OpenSSL::PKey::RSA.new(File.read('keys/public.key'))
    enc = Gitlab::License::Encryptor.new(pub)
    print enc.decrypt(File.read(ARGV[0]))
  `
  try {
    const rubyOut = execFileSync('ruby', ['-e', rubyScript, blobPath], {
      cwd: root,
      encoding: 'utf8',
    })
    check('Ruby decrypts TS output to the exact same JSON', rubyOut === compact,
      `ruby got ${rubyOut.slice(0, 80)}…`)
  } catch (err) {
    check('Ruby decrypts TS output to the exact same JSON', false, String(err))
  }
} else {
  console.log('  – skipped (legacy lib/ already removed)')
}

console.log()
if (failures > 0) {
  console.error(`${failures} check(s) failed.`)
  process.exit(1)
}
console.log('All crypto parity checks passed.')
