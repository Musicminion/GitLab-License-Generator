const en = {
  app: {
    title: 'GitLab License Generator',
    subtitle: 'Generate GitLab development licenses entirely in your browser — nothing is uploaded.',
    disclaimer:
      'For development and testing purposes only. You are responsible for complying with GitLab’s terms.',
    footer: 'Runs 100% client-side · WTFPL',
  },
  tabs: {
    generate: 'Generate License',
    deploy: 'Deployment Guide',
    keys: 'Key Tools',
  },
  form: {
    title: 'License details',
    name: 'Licensee name',
    company: 'Company',
    email: 'Email',
    plan: 'Plan',
    userCount: 'Active user count',
    startsAt: 'Issued at (starts at)',
    expiresAt: 'Expires at',
    blockChangesAt: 'Block changes at',
    keySource: 'Signing key',
    keySourceBundled: 'Bundled key',
    keySourceGenerated: 'Generated key pair',
    keySourceGeneratedHint: 'Generate a key pair in the Key Tools tab first.',
    advanced: 'Advanced',
    generate: 'Generate license',
    reset: 'Reset to defaults',
  },
  plans: {
    ultimate: 'Ultimate',
    premium: 'Premium',
    starter: 'Starter',
  },
  errors: {
    required: 'This field is required.',
    invalidPlan: 'Plan must be ultimate, premium or starter.',
    minUserCount: 'User count must be a positive integer.',
    invalidDate: 'Enter a valid date.',
    expiryInPast: 'Expiry date must be in the future.',
    generateFailed: 'License generation failed: {{message}}',
    noGeneratedKey: 'No generated key pair available. Create one in the Key Tools tab.',
  },
  result: {
    title: 'Generated license',
    empty: 'Fill in the form and generate a license to see the result here.',
    jsonTab: 'License JSON',
    blobTab: 'License file',
    blobHint: 'This is the content of result.gitlab-license.',
    download: 'Download result.gitlab-license',
    copy: 'Copy',
    copied: 'Copied',
    verified: 'Round-trip verified: the file decrypts back to the JSON above.',
  },
  deploy: {
    title: 'Install the license in GitLab',
    intro:
      'GitLab validates licenses with a bundled public key. Replace that public key with the one below, then upload the generated license file.',
    downloadPublicKey: 'Download public.key',
    method: 'Your GitLab deployment',
    methods: {
      omnibus: 'Omnibus / Linux package',
      docker: 'Docker (docker run)',
      compose: 'Docker Compose',
      helm: 'Helm / Kubernetes',
    },
    replaceTitle: '1. Replace the public key',
    replaceDesc: {
      omnibus:
        'Copy the downloaded public.key over GitLab’s encryption key, then reconfigure and restart.',
      docker:
        'Mount the downloaded public.key over GitLab’s encryption key when starting the container.',
      compose:
        'Add the downloaded public.key as a volume in your docker-compose.yml, then recreate the container.',
      helm:
        'Mount the downloaded public.key into the Webservice (and Sidekiq) pods at GitLab’s encryption key path.',
    },
    helmWarning:
      'The Helm steps are best-effort and not officially verified — exact values keys vary by chart version.',
    uploadTitle: '2. Upload the license',
    uploadDesc:
      'Sign in as an administrator, open Admin Area → Settings → General, and upload result.gitlab-license. You can also go directly to {{url}}.',
    servicePingTitle: '3. Disable Service Ping (optional)',
    servicePingDesc:
      'To stop usage data collection, add the following to /etc/gitlab/gitlab.rb and reconfigure.',
    troubleshootTitle: 'Troubleshooting',
    troubleshootDesc:
      'HTTP 502 right after restart simply means GitLab is still starting up — wait a minute and retry.',
  },
  keys: {
    title: 'RSA key pair',
    bundledTitle: 'Bundled key pair',
    bundledIntro:
      'By default licenses are signed with the key pair shipped in this project. Its public key is what you install into GitLab.',
    showPublic: 'Show bundled public key',
    generateTitle: 'Generate your own key pair',
    generateIntro:
      'Prefer a unique key pair? Generate a fresh 2048-bit RSA pair. The private key signs licenses; install the public key into GitLab.',
    generateButton: 'Generate new key pair',
    generating: 'Generating…',
    privateKey: 'Private key',
    publicKey: 'Public key',
    downloadPrivate: 'Download private.key',
    downloadPublic: 'Download public.key',
    useForGeneration: 'Use this key pair for license generation',
    inUse: 'This generated key pair is now selected for license generation.',
    warning:
      'Keep the private key safe. If you generate your own pair, you must install its public key into GitLab.',
  },
  common: {
    language: 'Language',
  },
}

export default en
