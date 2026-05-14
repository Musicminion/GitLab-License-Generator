import type en from './en'

const fr: typeof en = {
  app: {
    title: 'Générateur de licence GitLab',
    subtitle:
      'Générez des licences de développement GitLab entièrement dans votre navigateur — rien n’est envoyé.',
    disclaimer:
      'À des fins de développement et de test uniquement. Le respect des conditions de GitLab vous incombe.',
    footer: '100 % côté client · WTFPL',
  },
  tabs: {
    generate: 'Générer une licence',
    deploy: 'Guide de déploiement',
    keys: 'Outils de clés',
  },
  form: {
    title: 'Détails de la licence',
    name: 'Nom du titulaire',
    company: 'Société',
    email: 'E-mail',
    plan: 'Forfait',
    userCount: 'Nombre d’utilisateurs actifs',
    startsAt: 'Date d’émission (date de début)',
    expiresAt: 'Date d’expiration',
    blockChangesAt: 'Date de blocage des modifications',
    keySource: 'Clé de signature',
    keySourceBundled: 'Clé intégrée',
    keySourceGenerated: 'Paire de clés générée',
    keySourceGeneratedHint: 'Générez d’abord une paire de clés dans l’onglet Outils de clés.',
    advanced: 'Avancé',
    generate: 'Générer la licence',
    reset: 'Réinitialiser',
  },
  plans: {
    ultimate: 'Ultimate',
    premium: 'Premium',
    starter: 'Starter',
  },
  errors: {
    required: 'Ce champ est obligatoire.',
    invalidPlan: 'Le forfait doit être ultimate, premium ou starter.',
    minUserCount: 'Le nombre d’utilisateurs doit être un entier positif.',
    invalidDate: 'Saisissez une date valide.',
    expiryInPast: 'La date d’expiration doit être dans le futur.',
    generateFailed: 'Échec de la génération de la licence : {{message}}',
    noGeneratedKey:
      'Aucune paire de clés générée disponible. Créez-en une dans l’onglet Outils de clés.',
  },
  result: {
    title: 'Licence générée',
    empty: 'Remplissez le formulaire et générez une licence pour voir le résultat ici.',
    jsonTab: 'JSON de la licence',
    blobTab: 'Fichier de licence',
    blobHint: 'Voici le contenu de result.gitlab-license.',
    download: 'Télécharger result.gitlab-license',
    copy: 'Copier',
    copied: 'Copié',
    verified: 'Vérifié par aller-retour : le fichier se déchiffre bien vers le JSON ci-dessus.',
  },
  deploy: {
    title: 'Installer la licence dans GitLab',
    intro:
      'GitLab valide les licences avec une clé publique intégrée. Remplacez cette clé publique par celle ci-dessous, puis téléversez le fichier de licence généré.',
    downloadPublicKey: 'Télécharger public.key',
    method: 'Votre déploiement GitLab',
    methods: {
      omnibus: 'Omnibus / paquet Linux',
      docker: 'Docker (docker run)',
      compose: 'Docker Compose',
      helm: 'Helm / Kubernetes',
    },
    replaceTitle: '1. Remplacer la clé publique',
    replaceDesc: {
      omnibus:
        'Copiez le public.key téléchargé sur la clé de chiffrement de GitLab, puis reconfigurez et redémarrez.',
      docker:
        'Montez le public.key téléchargé sur la clé de chiffrement de GitLab au démarrage du conteneur.',
      compose:
        'Ajoutez le public.key téléchargé comme volume dans votre docker-compose.yml, puis recréez le conteneur.',
      helm:
        'Montez le public.key téléchargé dans les pods Webservice (et Sidekiq) au chemin de la clé de chiffrement de GitLab.',
    },
    helmWarning:
      'Les étapes Helm sont fournies au mieux et ne sont pas officiellement vérifiées — les clés de configuration varient selon la version du chart.',
    uploadTitle: '2. Téléverser la licence',
    uploadDesc:
      'Connectez-vous en tant qu’administrateur, ouvrez Admin Area → Settings → General et téléversez result.gitlab-license. Vous pouvez aussi aller directement sur {{url}}.',
    servicePingTitle: '3. Désactiver Service Ping (facultatif)',
    servicePingDesc:
      'Pour arrêter la collecte des données d’usage, ajoutez ceci à /etc/gitlab/gitlab.rb puis reconfigurez.',
    troubleshootTitle: 'Dépannage',
    troubleshootDesc:
      'Une erreur HTTP 502 juste après le redémarrage signifie simplement que GitLab démarre encore — attendez une minute et réessayez.',
  },
  keys: {
    title: 'Paire de clés RSA',
    bundledTitle: 'Paire de clés intégrée',
    bundledIntro:
      'Par défaut, les licences sont signées avec la paire de clés fournie dans ce projet. Sa clé publique est celle à installer dans GitLab.',
    showPublic: 'Afficher la clé publique intégrée',
    generateTitle: 'Générer votre propre paire de clés',
    generateIntro:
      'Vous préférez une paire de clés unique ? Générez une nouvelle paire RSA de 2048 bits. La clé privée signe les licences ; installez la clé publique dans GitLab.',
    generateButton: 'Générer une nouvelle paire de clés',
    generating: 'Génération…',
    privateKey: 'Clé privée',
    publicKey: 'Clé publique',
    downloadPrivate: 'Télécharger private.key',
    downloadPublic: 'Télécharger public.key',
    useForGeneration: 'Utiliser cette paire de clés pour la génération de licence',
    inUse: 'Cette paire de clés générée est maintenant sélectionnée pour la génération de licence.',
    warning:
      'Gardez la clé privée en sécurité. Si vous générez votre propre paire, vous devez installer sa clé publique dans GitLab.',
  },
  common: {
    language: 'Langue',
  },
}

export default fr
