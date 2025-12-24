import { LitElement, html, css, unsafeCSS, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, extendsContext } from 'custom-card-helpers';
import { styleMap } from 'lit/directives/style-map.js';

// Color theme types
type ColorTheme = 'amber' | 'blue' | 'emerald' | 'violet' | 'cyan' | 'rose';
type CardType = 'toggle' | 'slider';

interface CardConfig {
  entity: string;
  name?: string;
  subtitle?: string;
  icon?: string;
  color?: ColorTheme;
  card_type?: CardType;
  show_state?: boolean;
  show_last_updated?: boolean;
}

// Color theme configurations
const colorThemes: Record<ColorTheme, {
  bg: string;
  text: string;
  glow: string;
  gradient: string;
}> = {
  amber: {
    bg: '#f59e0b',
    text: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.5)',
    gradient: 'linear-gradient(135deg, #fbbf24, #f97316)',
  },
  blue: {
    bg: '#3b82f6',
    text: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.5)',
    gradient: 'linear-gradient(135deg, #60a5fa, #06b6d4)',
  },
  emerald: {
    bg: '#10b981',
    text: '#34d399',
    glow: 'rgba(16, 185, 129, 0.5)',
    gradient: 'linear-gradient(135deg, #34d399, #14b8a6)',
  },
  violet: {
    bg: '#8b5cf6',
    text: '#a78bfa',
    glow: 'rgba(139, 92, 246, 0.5)',
    gradient: 'linear-gradient(135deg, #a78bfa, #a855f7)',
  },
  cyan: {
    bg: '#06b6d4',
    text: '#22d3ee',
    glow: 'rgba(6, 182, 212, 0.5)',
    gradient: 'linear-gradient(135deg, #22d3ee, #0ea5e9)',
  },
  rose: {
    bg: '#f43f5e',
    text: '#fb7185',
    glow: 'rgba(244, 63, 94, 0.5)',
    gradient: 'linear-gradient(135deg, #fb7185, #ec4899)',
  },
};

@customElement('smart-glass-card')
export class SmartGlassCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: CardConfig;
  @state() private isPressing = false;

  // Entity state
  private get entity() {
    return this.hass?.states[this.config.entity];
  }

  private get isOn() {
    return this.entity?.state !== 'off' && this.entity?.state !== 'unavailable';
  }

  private get brightness() {
    if (this.entity?.attributes?.brightness !== undefined) {
      return Math.round((this.entity.attributes.brightness / 255) * 100);
    }
    return this.isOn ? 100 : 0;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .smart-card {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        position: relative;
        overflow: hidden;
        border-radius: 28px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(24px) saturate(180%);
        background: rgba(15, 23, 42, 0.6);
        min-height: 140px;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      .smart-card:hover {
        border-color: rgba(255, 255, 255, 0.1);
      }

      .smart-card:active,
      .smart-card.pressing {
        transform: scale(0.98);
      }

      .bg-glow {
        position: absolute;
        right: -40px;
        top: -40px;
        width: 160px;
        height: 160px;
        border-radius: 50%;
        filter: blur(60px);
        pointer-events: none;
        transition: all 0.7s ease;
        opacity: 0;
      }

      .bg-glow.active {
        opacity: 0.2;
      }

      ha-icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon-container {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.5s ease;
      }

      .icon-container.active {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
      }

      .icon-container.active ha-icon {
        animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      .slider-container {
        margin-top: 16px;
        height: 48px;
        background: rgba(2, 6, 23, 0.5);
        border-radius: 16px;
        display: flex;
        align-items: center;
        padding: 4px;
        position: relative;
        overflow: hidden;
        transition: all 0.5s ease;
        opacity: 0;
        max-height: 0;
      }

      .slider-container.visible {
        opacity: 1;
        max-height: 80px;
      }

      .slider-fill {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.1);
        transition: width 0.3s ease;
      }

      .slider-input {
        opacity: 0;
        cursor: ew-resize;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 20;
        margin: 0;
      }

      .slider-input::-webkit-slider-thumb {
        -webkit-appearance: none;
      }

      .slider-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0 12px;
        position: relative;
        z-index: 10;
        pointer-events: none;
      }

      .card-title {
        font-weight: 600;
        font-size: 18px;
        letter-spacing: 0.025em;
        transition: color 0.3s ease;
        line-height: 1.2;
      }

      .card-subtitle {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.4;
      }

      .state-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        transition: background-color 0.3s ease;
      }

      @media (prefers-color-scheme: dark) {
        .smart-card {
          background: rgba(15, 23, 42, 0.7);
        }
      }
    `;
  }

  setConfig(config: CardConfig) {
    if (!config.entity) {
      throw new Error('Entity is required');
    }
    this.config = config;
  }

  getCardSize(): number {
    return this.config.card_type === 'slider' ? 3 : 2;
  }

  private getDefaultColor(entityId: string): ColorTheme {
    if (entityId.startsWith('light.')) return 'amber';
    if (entityId.startsWith('fan.')) return 'emerald';
    if (entityId.startsWith('climate.') || entityId.startsWith('water_heater.')) return 'cyan';
    if (entityId.startsWith('switch.')) return 'rose';
    return 'blue';
  }

  private get theme(): ColorTheme {
    return this.config.color || this.getDefaultColor(this.config.entity);
  }

  private get themeColors() {
    return colorThemes[this.theme];
  }

  private handleToggle(e: Event) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('slider-input')) return;

    if (!this.hass || !this.config.entity) return;

    this.hass.callService('homeassistant', 'toggle', {
      entity_id: this.config.entity,
    });
  }

  private handleSliderChange(e: Event) {
    if (!this.hass || !this.config.entity) return;

    const target = e.target as HTMLInputElement;
    const percentage = parseInt(target.value);
    const brightness = Math.round((percentage / 100) * 255);

    this.hass.callService('light', 'turn_on', {
      entity_id: this.config.entity,
      brightness: brightness,
    });
  }

  private handlePressStart() {
    this.isPressing = true;
  }

  private handlePressEnd() {
    this.isPressing = false;
  }

  render() {
    if (!this.entity) {
      return html`<ha-card>Entity not found</ha-card>`;
    }

    const theme = this.themeColors;
    const name = this.config.name || this.entity.attributes.friendly_name || 'Unknown';
    const icon = this.config.icon || this.entity.attributes.icon || 'mdi:lightbulb';
    const subtitle = this.config.subtitle || (this.isOn ? 'Active' : 'Standby');
    const cardType = this.config.card_type || 'toggle';
    const isSlider = cardType === 'slider';

    const iconStyle = styleMap({
      background: this.isOn ? theme.gradient : 'rgba(255, 255, 255, 0.05)',
      color: this.isOn ? '#ffffff' : '#94a3b8',
      boxShadow: this.isOn ? theme.glow : 'none',
    });

    const titleStyle = styleMap({
      color: this.isOn ? '#ffffff' : '#cbd5e1',
    });

    const glowStyle = styleMap({
      backgroundColor: theme.bg,
    });

    const indicatorStyle = styleMap({
      backgroundColor: this.isOn ? theme.bg : '#334155',
    });

    return html`
      <div
        class="smart-card ${this.isPressing ? 'pressing' : ''}"
        @click="${this.handleToggle}"
        @mousedown="${this.handlePressStart}"
        @mouseup="${this.handlePressEnd}"
        @mouseleave="${this.handlePressEnd}"
        @touchstart="${this.handlePressStart}"
        @touchend="${this.handlePressEnd}"
      >
        <div class="bg-glow ${this.isOn ? 'active' : ''}" style="${glowStyle}"></div>

        <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; position: relative; z-index: 10;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="icon-container ${this.isOn ? 'active' : ''}" style="${iconStyle}">
              <ha-icon icon="${icon}"></ha-icon>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
              <div class="state-indicator" style="${indicatorStyle}"></div>
            </div>
          </div>

          <div style="margin-top: 24px;">
            <h3 class="card-title" style="${titleStyle}">${name}</h3>
            <p class="card-subtitle" style="color: #64748b;">${subtitle}</p>
          </div>

          ${isSlider ? html`
            <div class="slider-container ${this.isOn ? 'visible' : ''}">
              <div
                class="slider-fill"
                style="${styleMap({ width: `${this.brightness}%` })}"
              ></div>
              <input
                type="range"
                min="0"
                max="100"
                value="${this.brightness}"
                class="slider-input"
                @input="${this.handleSliderChange}"
              />
              <div class="slider-content">
                <ha-icon icon="${icon}" style="color: #64748b; --mdc-icon-size: 14px;"></ha-icon>
                <span style="font-size: 12px; font-weight: 700; color: rgba(255, 255, 255, 0.8);">
                  ${this.brightness}%
                </span>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

// For HACS
declare global {
  interface HTMLElementTagNameMap {
    'smart-glass-card': SmartGlassCard;
  }
}

// Register card config
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'smart-glass-card',
  name: 'Smart Glass Card',
  preview: true,
  description: 'Modern glassmorphism card with smooth animations',
});
