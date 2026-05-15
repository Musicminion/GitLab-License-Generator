import type en from './en'

const ru: typeof en = {
  app: {
    title: 'Генератор лицензий GitLab',
    subtitle:
      'Создавайте лицензии GitLab для разработки полностью в браузере — ничего не отправляется на сервер.',
    disclaimer:
      'Только для целей разработки и тестирования. Соблюдение условий GitLab — ваша ответственность.',
    footer: '© Ayaka-notes 2026 · WTFPL',
  },
  tabs: {
    generate: 'Создать лицензию',
    verify: 'Проверить лицензию',
    deploy: 'Руководство по установке',
    keys: 'Инструменты ключей',
  },
  form: {
    title: 'Данные лицензии',
    name: 'Имя лицензиата',
    company: 'Компания',
    email: 'Эл. почта',
    plan: 'Тариф',
    userCount: 'Количество активных пользователей',
    startsAt: 'Дата выдачи (дата начала)',
    expiresAt: 'Дата окончания',
    blockChangesAt: 'Дата блокировки изменений',
    keySource: 'Ключ подписи',
    keySourceBundled: 'Встроенный ключ',
    keySourceGenerated: 'Сгенерированная пара ключей',
    keySourceGeneratedHint: 'Сначала создайте пару ключей на вкладке «Инструменты ключей».',
    selectKeyPair: 'Пара ключей',
    selectKeyPairPlaceholder: 'Выберите сгенерированную пару ключей',
    advanced: 'Дополнительно',
    generate: 'Создать лицензию',
    reset: 'Сбросить к значениям по умолчанию',
  },
  plans: {
    ultimate: 'Ultimate',
    premium: 'Premium',
    starter: 'Starter',
  },
  errors: {
    required: 'Это поле обязательно.',
    invalidPlan: 'Тариф должен быть ultimate, premium или starter.',
    minUserCount: 'Количество пользователей должно быть положительным целым числом.',
    invalidDate: 'Введите корректную дату.',
    expiryInPast: 'Дата окончания должна быть в будущем.',
    generateFailed: 'Не удалось создать лицензию: {{message}}',
    noGeneratedKey: 'Выберите сгенерированную пару ключей.',
  },
  result: {
    title: 'Созданная лицензия',
    empty: 'Заполните форму и создайте лицензию, чтобы увидеть результат здесь.',
    jsonTab: 'JSON лицензии',
    blobTab: 'Файл лицензии',
    blobHint: 'Это содержимое файла result.gitlab-license.',
    download: 'Скачать result.gitlab-license',
    clear: 'Очистить',
    verified: 'Проверено в обе стороны: файл расшифровывается обратно в JSON выше.',
  },
  verify: {
    title: 'Проверить лицензию',
    resultTitle: 'Результат проверки',
    intro:
      'Вставьте или загрузите файл .gitlab-license, чтобы расшифровать и просмотреть его — ничего не покидает ваш браузер.',
    inputLabel: 'Содержимое файла лицензии',
    inputPlaceholder: 'Вставьте сюда содержимое result.gitlab-license…',
    upload: 'Загрузить файл',
    keySource: 'Ключ проверки',
    keySourceCustom: 'Свой открытый ключ',
    customKeyPlaceholder: 'Вставьте сюда открытый ключ (PEM)…',
    verifyButton: 'Проверить лицензию',
    empty: 'Здесь появятся данные расшифрованной лицензии.',
    okActive: 'Действительна — лицензия корректно расшифровывается и не истекла.',
    okExpired: 'Лицензия корректно расшифровывается, но срок её действия истёк.',
    decryptFailed: 'Не удалось расшифровать — неверный ключ или это не действительная лицензия GitLab.',
    status: 'Статус',
    statusActive: 'Активна',
    statusExpired: 'Истекла',
  },
  deploy: {
    title: 'Установка лицензии в GitLab',
    intro:
      'GitLab проверяет лицензии с помощью встроенного открытого ключа. Замените этот ключ на приведённый ниже, затем загрузите созданный файл лицензии.',
    downloadPublicKey: 'Скачать public.key',
    keyToInstall: 'Открытый ключ для установки',
    method: 'Ваш способ развёртывания GitLab',
    methods: {
      omnibus: 'Omnibus / пакет Linux',
      docker: 'Docker (docker run)',
      compose: 'Docker Compose',
      helm: 'Helm / Kubernetes',
    },
    replaceTitle: '1. Замените открытый ключ',
    replaceDesc: {
      omnibus:
        'Скопируйте скачанный public.key поверх ключа шифрования GitLab, затем выполните reconfigure и перезапуск.',
      docker:
        'Примонтируйте скачанный public.key поверх ключа шифрования GitLab при запуске контейнера.',
      compose:
        'Добавьте скачанный public.key как том в docker-compose.yml, затем пересоздайте контейнер.',
      helm:
        'Примонтируйте скачанный public.key в поды Webservice (и Sidekiq) по пути ключа шифрования GitLab.',
    },
    helmWarning:
      'Шаги для Helm приведены по мере возможности и официально не проверены — конкретные ключи конфигурации зависят от версии chart.',
    uploadTitle: '2. Загрузите лицензию',
    uploadDesc:
      'Войдите как администратор, откройте Admin Area → Settings → General, затем найдите «License» и загрузите result.gitlab-license.',
    servicePingTitle: '3. Отключите Service Ping (необязательно)',
    servicePingDesc:
      'Чтобы прекратить сбор данных об использовании, добавьте следующее в /etc/gitlab/gitlab.rb и выполните reconfigure.',
    troubleshootTitle: 'Устранение неполадок',
    troubleshootDesc:
      'Ошибка HTTP 502 сразу после перезапуска означает, что GitLab ещё запускается — подождите минуту и повторите.',
  },
  keys: {
    title: 'Пара ключей RSA',
    warning:
      'Храните закрытые ключи в безопасности. Если вы подписываете своей парой, необходимо установить её открытый ключ в GitLab.',
    bundledTitle: 'Встроенная пара ключей',
    bundledIntro:
      'По умолчанию лицензии подписываются парой ключей, входящей в этот проект. Её открытый ключ и нужно установить в GitLab.',
    showPublic: 'Показать встроенный открытый ключ',
    downloadPublic: 'Скачать public.key',
    downloadPrivate: 'Скачать private.key',
    generateTitle: 'Создайте собственную пару ключей',
    generateIntro:
      'Нужна уникальная пара ключей? Создайте новую пару RSA 2048 бит. Закрытый ключ подписывает лицензии; открытый ключ установите в GitLab.',
    generateButton: 'Создать новую пару ключей',
    generating: 'Создание…',
    generatedSuccess: 'Пара ключей создана и сохранена.',
    savedHint:
      'Сгенерированные пары ключей сохраняются в этом браузере и могут быть выбраны как ключ подписи на вкладке «Создать лицензию».',
    listTitle: 'Сгенерированные пары ключей',
    empty: 'Пар ключей пока нет — создайте одну выше.',
    privateKey: 'Закрытый ключ',
    publicKey: 'Открытый ключ',
    deleteConfirm: 'Удалить эту пару ключей?',
    importTitle: 'Импортировать существующую пару ключей',
    importIntro:
      'Уже есть пара ключей? Вставьте или загрузите закрытый ключ в формате PEM (по желанию — и открытый). Открытый ключ будет выведен из закрытого и сверен.',
    importPrivateLabel: 'Закрытый ключ (PEM, обязателен)',
    importPrivatePlaceholder: '-----BEGIN RSA PRIVATE KEY----- …',
    importPublicLabel: 'Открытый ключ (PEM)',
    importPublicHint: 'Необязательно — позволяет проверить соответствие ключей.',
    importPublicPlaceholder: '-----BEGIN PUBLIC KEY----- …',
    importNameLabel: 'Название',
    importNamePlaceholder: 'Удобное имя для этой пары ключей',
    importUploadFile: 'Загрузить из файла',
    importButton: 'Импортировать пару',
    importSuccess: 'Пара ключей импортирована и сохранена.',
    importedName: 'Импортированная пара',
    importPrivateRequired: 'Требуется закрытый ключ в формате PEM.',
    import_invalidPrivate: 'Не удалось разобрать закрытый ключ — убедитесь, что это корректный RSA-ключ в PEM.',
    import_invalidPublic: 'Не удалось разобрать открытый ключ — убедитесь, что это корректный PEM.',
    import_keyMismatch: 'Открытый ключ не соответствует закрытому.',
    importFailed: 'Не удалось импортировать пару ключей.',
  },
  common: {
    language: 'Язык',
    copy: 'Копировать',
    copied: 'Скопировано',
  },
}

export default ru
