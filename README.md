<div align="center">

<img src="./public/logo.svg" width="128" alt="GitLab License Generator logo" />

# GitLab License Generator

A static web app that generates GitLab development licenses **entirely in your browser**.
Built with React + Ant Design. No backend, no data leaves your machine.

</div>

> For **development and testing purposes** only. You are responsible for complying
> with GitLab's terms. Last verified against the `gitlab-license` gem v2.4.0.

## How it works

A GitLab license is just a JSON document, encrypted and signed with an RSA key
pair. GitLab ships the **public** key and uses it to validate licenses; whoever
holds the **private** key can mint them.

This project bundles a key pair. The app:

1. Builds the license JSON from your form input.
2. Encrypts it with AES-128-CBC (random key + IV).
3. Signs the AES key with the RSA private key (`private_encrypt`, PKCS#1 v1.5).
4. Packs `{ data, key, iv }` and base64-encodes it — that's the `.gitlab-license` file.

All of this is a faithful TypeScript port of the original Ruby `gitlab-license`
logic (see `src/crypto/`). Parity is checked byte-for-byte against the Ruby
implementation — see [Verification](#verification).

To make GitLab accept the license you must also install the matching **public
key** into your GitLab instance. The app's *Deployment Guide* tab generates the
exact commands for your setup (Omnibus, Docker, Docker Compose, Helm).

## Usage

Just open the deployed page, fill in the form, and download `result.gitlab-license`.
Then follow the *Deployment Guide* tab to install the public key and upload the license.

Features:

- **Generate License** — licensee details, plan, user count and custom dates.
- **Deployment Guide** — copy-paste install commands per deployment method + `public.key` download.
- **Key Tools** — inspect the bundled key pair or generate your own 2048-bit RSA pair.
- Multi-language UI: English, 中文, Français, Русский.

## Local development

Requires Node.js 20+.

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build
```

### Verification

`npm run verify` cross-checks the TypeScript crypto against the original Ruby
implementation (loopback encrypt/decrypt, and — if a local `ruby` interpreter
and the legacy `lib/` are present — a byte-for-byte comparison). The loopback
check always runs; the Ruby cross-checks are skipped automatically once the
legacy code has been removed.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app
and publishes it to GitHub Pages.

The Vite `base` path defaults to `/GitLab-License-Generator/` (a GitHub Pages
project site). For a custom domain or different path, set the `VITE_BASE`
environment variable at build time, e.g. `VITE_BASE=/ npm run build`.

## Project structure

```
src/
├── crypto/        # TypeScript port of the gitlab-license logic
│   ├── keys.ts        # bundled key pair (imported from /keys)
│   ├── encryptor.ts   # AES + RSA private_encrypt / public_decrypt (node-forge)
│   ├── license.ts     # license attribute builder + validation
│   └── keygen.ts      # 2048-bit RSA key pair generation
├── components/    # React + Ant Design UI
├── i18n/          # react-i18next setup + en/zh/fr/ru locales
└── lib/           # small browser helpers
keys/              # the bundled RSA key pair (single source of truth)
scripts/verify.ts  # crypto parity check
```

## License

This project is licensed under the **WTFPL License**.
