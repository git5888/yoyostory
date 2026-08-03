# 故事星球后端

## 生产启动

1. 创建 PostgreSQL 数据库和 `yoyostory` 用户。
2. 使用 `schema.sql` 完成初始化，并将表所有者语句按实际数据库用户调整。
3. 复制 `.env.example` 为 `.env`，生产环境必须设置数据库连接、前端域名和随机 JWT 密钥。
4. 安装依赖并启动：`npm ci && npm start`。

上线前必须将 `UPLOAD_DIR` 指向持久化磁盘或对象存储挂载目录，并通过反向代理提供 HTTPS。健康检查地址为 `/api/health`。
