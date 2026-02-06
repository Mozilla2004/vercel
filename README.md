# Vercel 部署包 - 智能沟通操作系统 demo

> 独立的 Vercel 部署目录，不影响主项目

## 目录结构

```
vercel-deploy/
├── api/
│   └── analyze.js       # Vercel Serverless Function (API 端点)
├── index.html           # 前端页面
├── vercel.json          # Vercel 配置文件
├── .env.example         # 环境变量示例
└── README.md            # 本文件
```

## 快速部署（Trae）

### 方法 1：使用 Vercel CLI

```bash
cd vercel-deploy
vercel
```

### 方法 2：连接 GitHub 仓库

1. 将此目录推送到 GitHub 仓库
2. 在 Vercel 导入该仓库
3. 配置环境变量（见下方）

## 环境变量配置（必须）

在 Vercel Dashboard 中配置：

1. 打开项目 → **Settings** → **Environment Variables**
2. 添加环境变量：
   - **Key**: `QWEN_API_KEY`
   - **Value**: 你的通义千问 API Key (`sk-xxxxxx...`)
   - **Environment**: 勾选 `Production`, `Preview`, `Development`
3. 保存后重新部署

## 获取 Qwen API Key

访问：https://dashscope.console.aliyun.com/

## 工作原理

```
用户浏览器
    ↓ POST /api/analyze
Vercel Serverless Function (api/analyze.js)
    ↓ HTTPS Request
通义千问 API (dashscope.aliyuncs.com)
    ↓ JSON Response
返回给前端展示
```

## 与腾讯云部署对比

| 特性 | 腾讯云部署 | Vercel 部署 |
|------|-----------|-------------|
| 后端 | Python Flask | Serverless Function |
| 维护 | 需要维护服务器 | 零维护 |
| 成本 | 固定服务器费用 | 按使用量付费（免费额度） |
| 部署 | SSH + Nginx 配置 | 一键部署 |
| 适用场景 | 生产环境 | 快速 Demo / 静态站点 |

## 故障排除

### 错误: "QWEN_API_KEY not configured"
**原因**: 环境变量未设置
**解决**: 在 Vercel Dashboard 添加 `QWEN_API_KEY`

### 错误: "分析失败：Failed to execute 'json' on 'Response'"
**原因**: API 函数未正确部署或返回异常
**解决**:
1. 检查 Vercel Functions 日志
2. 确认 `api/analyze.js` 文件存在
3. 查看具体错误信息

### 错误: "Qwen API request failed"
**原因**: API Key 无效或额度用完
**解决**:
1. 验证 API Key 是否正确
2. 检查通义千问控制台的剩余额度
3. 确认 API Key 未过期

## 技术栈

- **前端**: 原生 HTML + CSS + JavaScript
- **后端**: Vercel Serverless Function (Node.js)
- **AI 模型**: 通义千问 Qwen-Plus
- **托管**: Vercel

## 开发说明

如需修改代码：

1. 修改 `index.html` - 前端界面
2. 修改 `api/analyze.js` - API 逻辑
3. 提交到 GitHub 或运行 `vercel --prod` 重新部署

## 许可

Genesis-OS · 智能沟通操作系统 demo
