import type en from './en'

const zh: typeof en = {
  app: {
    title: 'GitLab License 生成器',
    subtitle: '完全在浏览器本地生成 GitLab 开发用 License,不会上传任何数据。',
    disclaimer: '仅供开发和测试用途。你需自行遵守 GitLab 的相关条款。',
    footer: '100% 纯前端运行 · WTFPL 协议',
  },
  tabs: {
    generate: '生成 License',
    deploy: '部署指引',
    keys: '密钥工具',
  },
  form: {
    title: 'License 信息',
    name: '授权人姓名',
    company: '公司',
    email: '邮箱',
    plan: '套餐',
    userCount: '活跃用户数',
    startsAt: '签发日期(生效日期)',
    expiresAt: '到期日期',
    blockChangesAt: '锁定变更日期',
    keySource: '签名密钥',
    keySourceBundled: '内置密钥',
    keySourceGenerated: '已生成的密钥对',
    keySourceGeneratedHint: '请先在「密钥工具」标签页生成一个密钥对。',
    advanced: '高级选项',
    generate: '生成 License',
    reset: '恢复默认值',
  },
  plans: {
    ultimate: 'Ultimate(旗舰版)',
    premium: 'Premium(高级版)',
    starter: 'Starter(入门版)',
  },
  errors: {
    required: '此项为必填。',
    invalidPlan: '套餐必须是 ultimate、premium 或 starter。',
    minUserCount: '用户数必须为正整数。',
    invalidDate: '请输入有效的日期。',
    expiryInPast: '到期日期必须晚于今天。',
    generateFailed: 'License 生成失败:{{message}}',
    noGeneratedKey: '没有可用的已生成密钥对,请先在「密钥工具」标签页创建。',
  },
  result: {
    title: '生成结果',
    empty: '填写左侧表单并生成 License 后,结果将显示在这里。',
    jsonTab: 'License JSON',
    blobTab: 'License 文件',
    blobHint: '这就是 result.gitlab-license 的文件内容。',
    download: '下载 result.gitlab-license',
    copy: '复制',
    copied: '已复制',
    verified: '已回环校验:该文件可解密还原为上方的 JSON。',
  },
  deploy: {
    title: '在 GitLab 中安装 License',
    intro:
      'GitLab 使用内置的公钥来校验 License。请先用下面的公钥替换 GitLab 的公钥,再上传生成的 License 文件。',
    downloadPublicKey: '下载 public.key',
    method: '你的 GitLab 部署方式',
    methods: {
      omnibus: 'Omnibus / Linux 安装包',
      docker: 'Docker(docker run)',
      compose: 'Docker Compose',
      helm: 'Helm / Kubernetes',
    },
    replaceTitle: '1. 替换公钥',
    replaceDesc: {
      omnibus: '用下载的 public.key 覆盖 GitLab 的加密公钥,然后 reconfigure 并重启。',
      docker: '启动容器时,把下载的 public.key 挂载到 GitLab 的加密公钥路径。',
      compose: '在 docker-compose.yml 中把下载的 public.key 添加为挂载卷,然后重建容器。',
      helm: '把下载的 public.key 挂载到 Webservice(以及 Sidekiq)Pod 中 GitLab 的加密公钥路径。',
    },
    helmWarning:
      'Helm 步骤为尽力而为的方案,未经官方验证 —— 具体的 values 配置项因 chart 版本而异。',
    uploadTitle: '2. 上传 License',
    uploadDesc:
      '以管理员身份登录,进入 Admin Area → Settings → General,上传 result.gitlab-license。也可以直接访问 {{url}}。',
    servicePingTitle: '3. 关闭 Service Ping(可选)',
    servicePingDesc:
      '如需关闭使用数据采集,在 /etc/gitlab/gitlab.rb 中加入以下内容并 reconfigure。',
    troubleshootTitle: '常见问题',
    troubleshootDesc:
      '重启后立即出现 HTTP 502,只是 GitLab 还在启动中 —— 稍等一分钟再重试即可。',
  },
  keys: {
    title: 'RSA 密钥对',
    bundledTitle: '内置密钥对',
    bundledIntro:
      '默认情况下,License 由本项目内置的密钥对签名。其公钥就是你需要安装到 GitLab 的那把。',
    showPublic: '查看内置公钥',
    generateTitle: '生成你自己的密钥对',
    generateIntro:
      '想用独立的密钥对?生成一对全新的 2048 位 RSA 密钥。私钥用于签名 License,公钥需安装到 GitLab。',
    generateButton: '生成新密钥对',
    generating: '生成中…',
    privateKey: '私钥',
    publicKey: '公钥',
    downloadPrivate: '下载 private.key',
    downloadPublic: '下载 public.key',
    useForGeneration: '使用此密钥对生成 License',
    inUse: '当前已选用此生成的密钥对来生成 License。',
    warning: '请妥善保管私钥。如果使用自己生成的密钥对,必须把对应公钥安装到 GitLab。',
  },
  common: {
    language: '语言',
  },
}

export default zh
