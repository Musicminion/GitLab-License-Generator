// Port of `lib/license/encryptor.rb` from the original Ruby project.
//
// A GitLab license blob is produced by:
//   1. AES-128-CBC encrypting the license JSON with a random key + IV
//   2. RSA `private_encrypt`-ing the AES key (raw RSA, PKCS#1 v1.5 type-1 pad)
//   3. base64( JSON({ data, key, iv }) )
//
// The Web Crypto API cannot do step 2 (private-key encryption with type-1
// padding), so we use node-forge. `privateKey.sign(bytes, 'NONE')` performs
// exactly OpenSSL's `RSA#private_encrypt`: type-1 padding, no DigestInfo wrapper.
import forge from 'node-forge'

interface EncryptionData {
  data: string
  key: string
  iv: string
}

/** Encrypt a plaintext license JSON string into a `.gitlab-license` blob. */
export function encryptLicense(plaintextJson: string, privateKeyPem: string): string {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem)

  // Symmetric AES-128-CBC encryption of the license payload (PKCS#7 padding).
  const aesKey = forge.random.getBytesSync(16)
  const iv = forge.random.getBytesSync(16)
  const cipher = forge.cipher.createCipher('AES-CBC', aesKey)
  cipher.start({ iv })
  cipher.update(forge.util.createBuffer(plaintextJson, 'utf8'))
  if (!cipher.finish()) {
    throw new Error('AES encryption failed')
  }
  const encryptedData = cipher.output.getBytes()

  // Asymmetric: encrypt the AES key with the RSA private key (== private_encrypt).
  const encryptedKey = privateKey.sign(aesKey, 'NONE')

  const encryptionData: EncryptionData = {
    data: forge.util.encode64(encryptedData),
    key: forge.util.encode64(encryptedKey),
    iv: forge.util.encode64(iv),
  }

  return forge.util.encode64(JSON.stringify(encryptionData))
}

/**
 * Decrypt a `.gitlab-license` blob back to its plaintext JSON.
 * Used for round-trip verification — not needed for normal generation, since
 * the plaintext is already known before encryption.
 */
export function decryptLicense(blob: string, publicKeyPem: string): string {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem)
  const encryptionData = JSON.parse(forge.util.decode64(blob.trim())) as EncryptionData

  const encryptedData = forge.util.decode64(encryptionData.data)
  const encryptedKey = forge.util.decode64(encryptionData.key)
  const iv = forge.util.decode64(encryptionData.iv)

  // `public_decrypt` of the AES key. The typings don't expose the raw RSA op,
  // so reach into the (well-documented) low-level `forge.pki.rsa.decrypt`.
  // The 4th arg (`ml`) must be left undefined so PKCS#1 v1.5 padding is
  // stripped — passing `false` makes forge return the raw padded block.
  const rsa = forge.pki.rsa as unknown as {
    decrypt(ed: string, key: forge.pki.rsa.PublicKey, pub: boolean): string
  }
  const aesKey = rsa.decrypt(encryptedKey, publicKey, true)

  const decipher = forge.cipher.createDecipher('AES-CBC', aesKey)
  decipher.start({ iv })
  decipher.update(forge.util.createBuffer(encryptedData))
  if (!decipher.finish()) {
    throw new Error('AES decryption failed')
  }
  return decipher.output.toString()
}
