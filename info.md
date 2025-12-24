# Smart Glass Card for Home Assistant

A beautiful, modern glassmorphism card for Home Assistant Lovelace UI inspired by contemporary smart home interfaces.

## Features

- Glassmorphism design with blur effects
- Smooth animations and transitions
- Support for toggle and slider controls
- Multiple color themes
- Interactive states with glow effects
- Responsive grid layout
- Touch-friendly interface

## Installation

1. Copy the `smart-glass-card` folder to your `/config/www/custom_components/` directory
2. Add the resource reference to your Lovelace configuration:

```yaml
resources:
  - type: module
    url: /local/custom_components/smart-glass-card/smart-glass-card.js
    type: module
```

Or via the Lovelace UI:
- Go to Configuration -> Lovelace Dashboards -> Resources
- Click "Add Resource"
- URL: `/local/custom_components/smart-glass-card/smart-glass-card.js`
- Type: `JavaScript Module`

## Configuration

### Basic Card Configuration

```yaml
type: custom:smart-glass-card
entity: light.living_room
name: Living Room
icon: mdi:lightbulb
color: amber
```

### Advanced Card Configuration

```yaml
type: custom:smart-glass-card
entity: light.living_room
name: Living Room
subtitle: Main ceiling light
icon: mdi:lightbulb
color: amber
card_type: slider
show_state: true
show_last_updated: true
```

### Color Options

- `amber` - Warm yellow/orange (default for lights)
- `blue` - Cool blue (default for temperature)
- `emerald` - Green (default for fans/eco)
- `violet` - Purple (default for scenes)
- `cyan` - Cyan (default for water/heating)
- `rose` - Pink/Red (default for heating devices)

### Card Types

- `toggle` - Simple on/off toggle (default)
- `slider` - Includes brightness/level slider

### Full Grid Example

```yaml
type: grid
columns: 2
square: false
cards:
  - type: custom:smart-glass-card
    entity: light.bedroom
    name: Bedroom Light
    icon: mdi:lightbulb
    color: amber
    card_type: slider

  - type: custom:smart-glass-card
    entity: fan.bathroom
    name: Vent Fan
    icon: mdi:fan
    color: emerald

  - type: custom:smart-glass-card
    entity: climate.thermostat
    name: Thermostat
    icon: mdi:thermometer
    color: cyan

  - type: custom:smart-glass-card
    entity: switch.towel_rail
    name: Towel Rail
    icon: mdi:radiator
    color: rose
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | required | Home Assistant entity ID |
| `name` | string | Entity name | Card title |
| `subtitle` | string | Auto | Subtitle/description |
| `icon` | string | Auto | MDI icon name |
| `color` | string | auto | Color theme name |
| `card_type` | string | toggle | Control type (toggle/slider) |
| `show_state` | boolean | true | Show entity state |
| `show_last_updated` | boolean | false | Show last updated time |
