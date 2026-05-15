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
/**
 * Validate an imported RSA private key PEM and optionally an accompanying
 * public key PEM. If `publicPem` is given, its modulus + exponent must match
 * the public half derived from the private key — otherwise the pair would
 * sign licenses that GitLab can't decrypt. Returns canonical PEMs (private
 * PKCS#1, public SPKI) regardless of input formatting.
 */
export function importKeyPair(privatePem: string, publicPem?: string): GeneratedKeyPair {
  let priv: forge.pki.rsa.PrivateKey
  try {
    priv = forge.pki.privateKeyFromPem(privatePem.trim()) as forge.pki.rsa.PrivateKey
  } catch {
    throw new Error('invalidPrivate')
  }
  const derived = forge.pki.setRsaPublicKey(priv.n, priv.e)
  if (publicPem && publicPem.trim()) {
    let pub: forge.pki.rsa.PublicKey
    try {
      pub = forge.pki.publicKeyFromPem(publicPem.trim()) as forge.pki.rsa.PublicKey
    } catch {
      throw new Error('invalidPublic')
    }
    if (!pub.n.equals(derived.n) || !pub.e.equals(derived.e)) {
      throw new Error('keyMismatch')
    }
  }
  return {
    privateKeyPem: forge.pki.privateKeyToPem(priv),
    publicKeyPem: forge.pki.publicKeyToPem(derived),
  }
}

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
