# Smart Glass Card for Home Assistant

<div align="center">

A modern glassmorphism card for Home Assistant Lovelace UI built with **Lit** and **TypeScript** for the latest Home Assistant versions (2025.12+).

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

</div>

## Features

- Glassmorphism design with blur effects
- Built with **Lit** for optimal performance
- **TypeScript** for type safety
- Support for toggle and slider controls
- Multiple color themes
- Smooth animations with CSS transitions
- Touch-friendly with press feedback
- Fully responsive design
- Compatible with Home Assistant 2025.12+

## Installation

### via HACS (Recommended)

1. Open HACS in Home Assistant
2. Navigate to **Frontend** → **Explore & Download**
3. Click the three dots menu → **Add custom repository**
4. Enter URL: `https://github.com/yourusername/smart-glass-card`
5. Category: **Lovelace**
6. Click **Add**
7. Click **Download** to install

### Manual Installation

1. Download the latest release from the [releases page](https://github.com/yourusername/smart-glass-card/releases)
2. Extract and copy `dist/smart-glass-card.js` to your Home Assistant:
   ```bash
   cp dist/smart-glass-card.js /homeassistant/config/www/
   ```

3. Add the resource reference:

**Via UI:**
Settings → Dashboards → More Options (⋮) → Edit → Raw Config
```yaml
resources:
  - type: module
    url: /hacsfiles/smart-glass-card/smart-glass-card.js
```

**Or via Configuration YAML:**
```yaml
lovelace:
  resources:
    - url: /hacsfiles/smart-glass-card/smart-glass-card.js
      type: module
```

## Usage

### Basic Configuration

```yaml
type: custom:smart-glass-card
entity: light.living_room
name: Living Room
icon: mdi:lightbulb
color: amber
```

### Light with Brightness Slider

```yaml
type: custom:smart-glass-card
entity: light.bedroom
name: Bedroom Light
subtitle: Main ceiling light
icon: mdi:lightbulb
color: amber
card_type: slider
```

### Climate Control

```yaml
type: custom:smart-glass-card
entity: climate.thermostat
name: Thermostat
icon: mdi:thermometer
color: cyan
```

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `entity` | string | Yes | - | Home Assistant entity ID |
| `name` | string | No | Entity friendly name | Card title |
| `subtitle` | string | No | Auto-generated | Subtitle/description |
| `icon` | string | No | Entity icon | MDI icon name |
| `color` | string | No | Auto-detected | Color theme (see below) |
| `card_type` | string | No | `toggle` | Control type: `toggle` or `slider` |

## Color Themes

| Theme | Description | Best For |
|-------|-------------|----------|
| `amber` | Warm yellow/orange | Lights |
| `blue` | Cool blue | Water, cooling |
| `emerald` | Green | Fans, eco devices |
| `violet` | Purple | Scenes, ambiance |
| `cyan` | Cyan | Heating, thermostats |
| `rose` | Pink/Red | Heating devices |

### Auto Color Detection

The card automatically selects a color based on entity type:
- **Lights** → `amber`
- **Fans** → `emerald`
- **Climate/Water Heater** → `cyan`
- **Switches** → `rose`
- **Other** → `blue`

## Examples

### Bathroom Dashboard

```yaml
title: Bathroom
path: bathroom
icon: mdi:shower
cards:
  - type: grid
    columns: 2
    square: false
    cards:
      - type: custom:smart-glass-card
        entity: light.bathroom_vanity
        name: Vanity Light
        icon: mdi:lightbulb
        color: amber
        card_type: slider

      - type: custom:smart-glass-card
        entity: fan.bathroom_exhaust
        name: Exhaust Fan
        icon: mdi:fan
        color: emerald

      - type: custom:smart-glass-card
        entity: switch.towel_rail
        name: Towel Rail
        icon: mdi:radiator
        color: rose

      - type: custom:smart-glass-card
        entity: water_heater.main
        name: Water Heater
        icon: mdi:water-pump
        color: cyan
```

### Kitchen Controls

```yaml
type: grid
columns: 2
square: false
cards:
  - type: custom:smart-glass-card
    entity: light.kitchen_main
    name: Kitchen Lights
    icon: mdi:lightbulb
    color: amber
    card_type: slider

  - type: custom:smart-glass-card
    entity: light.kitchen_under_cabinet
    name: Under Cabinet
    icon: mdi:led-strip
    color: blue
    card_type: slider

  - type: custom:smart-glass-card
    entity: switch.kitchen_exhaust
    name: Exhaust Fan
    icon: mdi:fan
    color: emerald

  - type: custom:smart-glass-card
    entity: scene.kitchen_cooking
    name: Cooking Mode
    icon: mdi:chef-hat
    color: violet
```

## Development

### Prerequisites

- Node.js 20+
- npm or yarn
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/smart-glass-card.git
cd smart-glass-card

# Install dependencies
npm install

# Start development server with watch mode
npm run watch

# Build for production
npm run build
```

### Project Structure

```
smart-glass-card/
├── src/
│   ├── smart-glass-card.ts    # Main card component
│   ├── index.ts               # Entry point
│   └── types/
│       └── global.d.ts        # TypeScript declarations
├── dist/                      # Compiled output
├── rollup.config.js           # Build configuration
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
└── README.md
```

### Building

```bash
# Build the card
npm run build

# The output will be in dist/smart-glass-card.js
# Copy this file to your Home Assistant instance
```

### Linting

```bash
# Run ESLint
npm run lint

# Format code
npm run format
```

## Tech Stack

- **Lit** - Lightweight web component library
- **TypeScript** - Type-safe JavaScript
- **Rollup** - Module bundler
- **Home Assistant JS WebSocket** - Official HA library

## Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+

## Troubleshooting

**Card not loading:**
- Check browser console (F12) for errors
- Verify the resource URL is correct
- Clear browser cache
- Ensure Home Assistant version is 2025.12 or later

**Styles not applying:**
- Make sure the card is on a dark background
- Check for CSS conflicts with other custom cards

**Slider not working:**
- Verify your entity supports brightness (light entities)
- Toggle-only entities don't show the slider

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details

## Credits

Inspired by modern smart home interfaces and glassmorphism design trends.

## Support

- GitHub Issues: [Report a bug](https://github.com/yourusername/smart-glass-card/issues)
- Home Assistant Community: [Forum thread](https://community.home-assistant.io/)

---

Made with ❤️ for the Home Assistant community
