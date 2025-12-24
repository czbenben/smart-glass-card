# HACS 安装指南

## 方法一：通过 HACS 安装（推荐）

### 步骤 1: 准备 GitHub 仓库

1. 在 GitHub 上创建一个新仓库（例如：`smart-glass-card`）
2. 将项目文件推送到该仓库

```bash
cd hacs-smart-card
git init
git add .
git commit -m "Initial commit: Smart Glass Card v1.0.0"
git branch -M main
git remote add origin https://github.com/你的用户名/smart-glass-card.git
git push -u origin main
```

### 步骤 2: 创建第一个 Release

1. 在 GitHub 仓库页面，点击右侧的 **"Releases"**
2. 点击 **"Create a new release"**
3. 输入标签版本：`v1.0.0`
4. 发布标题：`v1.0.0 - Initial Release`
5. 勾选 **"Set as the latest release"**
6. 点击 **"Publish release"**

或者使用命令行创建 release：

```bash
# 本地先构建
npm install
npm run build

# 创建并推送 tag
git tag -a v1.0.0 -m "v1.0.0 - Initial Release"
git push origin v1.0.0
```

### 步骤 3: 在 HACS 中添加

1. 打开 Home Assistant 的 **HACS** 面板
2. 点击右上角的 **三个点菜单 (⋮)**
3. 选择 **"Custom Repositories"** (自定义仓库)
4. 点击 **"Add custom repository"** (添加自定义仓库)
5. 填写信息：
   - **Repository**: `你的用户名/smart-glass-card`
   - **Category**: `Lovelace`
6. 点击 **"Add"**
7. 在列表中找到 **"Smart Glass Card"**
8. 点击卡片右侧的 **"Download"** 按钮安装

### 步骤 4: 添加资源引用

安装完成后，需要添加资源引用：

**方法 A：通过 UI 添加**
1. 在 Home Assistant 中，进入 **Settings** (设置) → **Dashboards** (仪表盘)
2. 点击右上角的 **三个点 (⋮)** → **Edit Dashboard** (编辑仪表盘)
3. 点击右上角的 **三个点 (⋮)** → **Raw configuration** (原始配置)
4. 在 `resources` 部分添加：

```yaml
resources:
  - type: module
    url: /hacsfiles/smart-glass-card/smart-glass-card.js
```

5. 点击 **Save** (保存)

**方法 B：通过 YAML 配置**

编辑 `configuration.yaml`：

```yaml
lovelace:
  mode: yaml
  resources:
    - url: /hacsfiles/smart-glass-card/smart-glass-card.js
      type: module
```

或者编辑 `.storage/lovelace`：

```yaml
resources:
  - type: module
    url: /hacsfiles/smart-glass-card/smart-glass-card.js
```

### 步骤 5: 刷新页面

1. 刷新浏览器页面（Ctrl+F5 或 Cmd+Shift+R）
2. 清除浏览器缓存（如果需要）

### 步骤 6: 使用卡片

在 Lovelace 仪表盘中添加：

```yaml
type: custom:smart-glass-card
entity: light.living_room
name: Living Room
icon: mdi:lightbulb
color: amber
card_type: slider
```

---

## 方法二：手动安装（不使用 HACS）

如果你不想使用 HACS，也可以手动安装：

### 步骤 1: 下载文件

从 [Releases](https://github.com/你的用户名/smart-glass-card/releases) 页面下载 `smart-glass-card.js`

### 步骤 2: 上传到 Home Assistant

**方法 A：通过 Samba/FTP**
- 将文件复制到 `/homeassistant/config/www/` 目录

**方法 B：通过配置面板**
1. 进入 **Settings** → **Storage**
2. 上传文件到 `/www/` 目录

### 步骤 3: 添加资源引用

```yaml
resources:
  - type: module
    url: /local/smart-glass-card.js
```

### 步骤 4: 使用卡片

同上，使用 `type: custom:smart-glass-card`

---

## 更新卡片

### 通过 HACS 更新

1. 打开 **HACS**
2. 找到 **"Smart Glass Card"**
3. 如果有更新，点击 **"Update"** 按钮
4. 刷新 Home Assistant 页面

### 手动更新

1. 下载最新版本的 `smart-glass-card.js`
2. 替换旧文件
3. 刷新 Home Assistant 页面

---

## 完整项目结构（用于 GitHub 仓库）

```
smart-glass-card/
├── .github/
│   └── workflows/
│       └── release.yml          # 自动发布 GitHub Actions
├── src/
│   ├── smart-glass-card.ts      # 主卡片组件
│   ├── index.ts
│   └── types/
│       └── global.d.ts
├── dist/
│   └── smart-glass-card.js      # 编译后的文件（发布时包含）
├── examples/
│   └── lovelace.yaml            # 示例配置
├── .gitignore
├── .prettierrc
├── CHANGELOG.md                 # 版本更新日志
├── hacs.json                    # HACS 配置文件
├── LICENSE
├── package.json
├── README.md
├── rollup.config.js
└── tsconfig.json
```

---

## 常见问题

### Q: HACS 中找不到 "Custom Repositories" 选项？
A: 确保你使用的是 HACS 最新版本。旧版本可能需要启用高级模式。

### Q: 安装后卡片不显示？
A:
1. 检查浏览器控制台是否有错误（F12）
2. 确认资源 URL 正确
3. 清除浏览器缓存后重试
4. 确认 Home Assistant 版本是 2025.12 或更高

### Q: 如何创建 GitHub Release？
A:
1. 在 GitHub 仓库页面点击 "Releases"
2. 点击 "Draft a new release"
3. 输入标签（如 v1.0.0）
4. 点击 "Publish release"

### Q: 卡片样式不正常？
A: 确保你的 Home Assistant 使用深色主题，该卡片专为深色背景设计。

---

## 验证安装

安装成功后，在 Lovelace 配置中应该能看到：

```yaml
type: custom:smart-glass-card
```

输入 `custom:` 后，编辑器应该自动提示 `smart-glass-card`。

---

## 下一步

安装完成后，查看 [README.md](README.md) 了解更多配置选项和示例。
