# 快速开始

## 最简单的测试方法

在 Home Assistant 的 Lovelace 配置中添加：

```yaml
type: custom:smart-glass-card
entity: light.your_light
```

就这么简单！卡片会自动：
- 检测实体类型并选择合适的颜色
- 显示实体的图标和名称
- 根据实体类型显示开关或滑块

## 完整示例

### 测试所有颜色主题

```yaml
type: vertical-stack
cards:
  - type: grid
    columns: 2
    square: false
    cards:
      - type: custom:smart-glass-card
        entity: light.living_room
        color: amber
        card_type: slider

      - type: custom:smart-glass-card
        entity: fan.bedroom
        color: emerald

      - type: custom:smart-glass-card
        entity: climate.thermostat
        color: cyan

      - type: custom:smart-glass-card
        entity: switch.kitchen
        color: rose
```

### 浏览器开发者工具检查

打开浏览器开发者工具（F12），在 Console 中应该没有错误信息。

## 下一步

- 查看 [README.md](README.md) 了解所有配置选项
- 查看 [examples/lovelace.yaml](examples/lovelace.yaml) 获取更多示例
