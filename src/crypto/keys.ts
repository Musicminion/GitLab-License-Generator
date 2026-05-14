// The key pair bundled with the project. The public key must be installed into
// the target GitLab instance; the private key signs the licenses we generate.
// These are imported verbatim from the repo's `keys/` directory so that folder
// stays the single source of truth.
import bundledPrivateKey from '../../keys/private.key?raw'
import bundledPublicKey from '../../keys/public.key?raw'

const normalize = (pem: string): string => pem.trim() + '\n'

export const BUNDLED_PRIVATE_KEY_PEM = normalize(bundledPrivateKey)
export const BUNDLED_PUBLIC_KEY_PEM = normalize(bundledPublicKey)
