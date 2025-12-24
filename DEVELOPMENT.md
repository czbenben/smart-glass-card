# 开发指南

## 本地开发

### 环境准备

```bash
# 进入项目目录
cd hacs-smart-card

# 安装依赖
npm install

# 开发模式（自动监听文件变化）
npm run watch

# 构建生产版本
npm run build
```

### 本地测试

1. 构建项目：
```bash
npm run build
```

2. 将 `dist/smart-glass-card.js` 复制到 Home Assistant：
```bash
# 方法 1: 通过 Samba 共享
cp dist/smart-glass-card.js /path/to/homeassistant/config/www/

# 方法 2: 通过 SCP
scp dist/smart-glass-card.js user@homeassistant:/config/www/
```

3. 在 Home Assistant 中添加资源：
```yaml
resources:
  - type: module
    url: /local/smart-glass-card.js
```

4. 刷新浏览器并测试

### 发布新版本

1. 更新版本号（在 `package.json` 中）：
```json
{
  "version": "1.0.1"
}
```

2. 更新 CHANGELOG.md

3. 创建 Git tag：
```bash
git tag -a v1.0.1 -m "v1.0.1 - Fix bug"
git push origin v1.0.1
```

4. GitHub Actions 会自动创建 Release

## 项目结构说明

```
smart-glass-card/
├── src/                        # 源代码目录
│   ├── smart-glass-card.ts     # 主组件（Lit + TypeScript）
│   ├── index.ts                # 入口文件
│   └── types/
│       └── global.d.ts         # 类型定义
├── dist/                       # 构建输出（自动生成）
│   ├── smart-glass-card.js     # 压缩后的生产版本
│   └── smart-glass-card.debug.js  # 未压缩的调试版本
├── .github/
│   └── workflows/
│       └── release.yml         # 自动发布配置
├── examples/
│   └── lovelace.yaml           # 使用示例
├── package.json                # 项目配置
├── tsconfig.json               # TypeScript 配置
├── rollup.config.js            # Rollup 打包配置
└── hacs.json                   # HACS 清单文件
```

## 代码规范

### TypeScript 配置

项目使用严格的 TypeScript 配置：
- 启用所有严格检查
- 不允许未使用的变量
- 要求显式返回类型

### Prettier 配置

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100
}
```

### 代码风格

- 使用 2 空格缩进
- 使用单引号
- 每行最多 100 字符
- 必须使用分号

## 调试技巧

### 浏览器控制台

```javascript
// 检查卡片是否注册
console.log(customElements.get('smart-glass-card'));

// 查看所有自定义卡片
console.log(window.customCards);

// 检查 Home Assistant 状态
window.hassConnection.then(conn => {
  console.log(conn.hass.states);
});
```

### 常见问题

**问题：类型错误**
```bash
# 清理并重新构建
rm -rf node_modules dist
npm install
npm run build
```

**问题：卡片不更新**
```bash
# 清除浏览器缓存
# 或使用无痕模式测试
```

**问题：构建失败**
```bash
# 检查 Node.js 版本
node --version  # 应该是 20+

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

## 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -m 'Add new feature'`
4. 推送到分支：`git push origin feature/new-feature`
5. 创建 Pull Request

### Commit 消息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：
```
feat(slider): add touch support for mobile devices

- Add touch event listeners
- Implement swipe gestures
- Update documentation

Closes #123
```
