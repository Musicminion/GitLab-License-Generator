// Port of `src/generator.keys.rb`: generate a fresh 2048-bit RSA key pair.
// The public key gets installed into GitLab; the private key signs licenses.
import forge from 'node-forge'

export interface GeneratedKeyPair {
  /** PKCS#1 PEM — matches the format of the bundled `keys/private.key`. */
  privateKeyPem: string
  /** SPKI PEM — matches the format of the bundled `keys/public.key`. */
  publicKeyPem: string
}

/**
 * Generate a 2048-bit RSA key pair (e = 65537). Runs asynchronously so the
 * UI thread is not blocked while the primes are searched for.
 */
export function generateKeyPair(): Promise<GeneratedKeyPair> {
  return new Promise((resolve, reject) => {
    forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 }, (err, keypair) => {
      if (err) {
        reject(err)
        return
      }
      resolve({
        privateKeyPem: forge.pki.privateKeyToPem(keypair.privateKey),
        publicKeyPem: forge.pki.publicKeyToPem(keypair.publicKey),
      })
    })
  })
}
