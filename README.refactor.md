# 重构计划

把项目迁移到 React，并且重构代码结构，作为一个静态的网页部署，最好可以使用 GitHub Pages 来部署。组件库使用阿里 Ant Design，需要支持 i18n 国际化，支持多语言切换。

需求：
- 根据用户指定的日期要求，生成 license 文件
- 根据 GitLab 部署的方式，比如 Docker，生成开发环境的 License，需要提供详细的命令
- 支持 Docker 构建，并通过 Dockerfile 来构建镜像，提供两阶段构建，用 nginx 作为生产环境最终前端资源