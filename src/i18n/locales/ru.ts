import type en from './en'

const ru: typeof en = {
  app: {
    title: 'Генератор лицензий GitLab',
    subtitle:
      'Создавайте лицензии GitLab для разработки полностью в браузере — ничего не отправляется на сервер.',
    disclaimer:
      'Только для целей разработки и тестирования. Соблюдение условий GitLab — ваша ответственность.',
    footer: 'Работает на 100% в браузере · WTFPL',
  },
  tabs: {
    generate: 'Создать лицензию',
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
    noGeneratedKey:
      'Нет доступной сгенерированной пары ключей. Создайте её на вкладке «Инструменты ключей».',
  },
  result: {
    title: 'Созданная лицензия',
    empty: 'Заполните форму и создайте лицензию, чтобы увидеть результат здесь.',
    jsonTab: 'JSON лицензии',
    blobTab: 'Файл лицензии',
    blobHint: 'Это содержимое файла result.gitlab-license.',
    download: 'Скачать result.gitlab-license',
    copy: 'Копировать',
    copied: 'Скопировано',
    verified: 'Проверено в обе стороны: файл расшифровывается обратно в JSON выше.',
  },
  deploy: {
    title: 'Установка лицензии в GitLab',
    intro:
      'GitLab проверяет лицензии с помощью встроенного открытого ключа. Замените этот ключ на приведённый ниже, затем загрузите созданный файл лицензии.',
    downloadPublicKey: 'Скачать public.key',
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
      'Войдите как администратор, откройте Admin Area → Settings → General и загрузите result.gitlab-license. Также можно перейти напрямую по адресу {{url}}.',
    servicePingTitle: '3. Отключите Service Ping (необязательно)',
    servicePingDesc:
      'Чтобы прекратить сбор данных об использовании, добавьте следующее в /etc/gitlab/gitlab.rb и выполните reconfigure.',
    troubleshootTitle: 'Устранение неполадок',
    troubleshootDesc:
      'Ошибка HTTP 502 сразу после перезапуска означает, что GitLab ещё запускается — подождите минуту и повторите.',
  },
  keys: {
    title: 'Пара ключей RSA',
    bundledTitle: 'Встроенная пара ключей',
    bundledIntro:
      'По умолчанию лицензии подписываются парой ключей, входящей в этот проект. Её открытый ключ и нужно установить в GitLab.',
    showPublic: 'Показать встроенный открытый ключ',
    generateTitle: 'Создайте собственную пару ключей',
    generateIntro:
      'Нужна уникальная пара ключей? Создайте новую пару RSA 2048 бит. Закрытый ключ подписывает лицензии; открытый ключ установите в GitLab.',
    generateButton: 'Создать новую пару ключей',
    generating: 'Создание…',
    privateKey: 'Закрытый ключ',
    publicKey: 'Открытый ключ',
    downloadPrivate: 'Скачать private.key',
    downloadPublic: 'Скачать public.key',
    useForGeneration: 'Использовать эту пару ключей для создания лицензий',
    inUse: 'Эта сгенерированная пара ключей теперь выбрана для создания лицензий.',
    warning:
      'Храните закрытый ключ в безопасности. Если вы создаёте свою пару, необходимо установить её открытый ключ в GitLab.',
  },
  common: {
    language: 'Язык',
  },
}

export default ru
