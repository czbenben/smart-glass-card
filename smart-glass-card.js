class SmartGlassCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOn = false;
    this.value = 100;
    this.entityId = null;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;
    this.entityId = config.entity;
    this.cardType = config.card_type || 'toggle';
    this.color = config.color || this.getDefaultColor(config.entity);
    this.render();
  }

  getDefaultColor(entity) {
    if (entity.startsWith('light.')) return 'amber';
    if (entity.startsWith('fan.')) return 'emerald';
    if (entity.startsWith('climate.') || entity.startsWith('water_heater.')) return 'cyan';
    if (entity.startsWith('switch.')) return 'rose';
    return 'blue';
  }

  getCardSize() {
    return this.cardType === 'slider' ? 3 : 2;
  }

  static getStubConfig() {
    return {
      entity: 'light.example',
      name: 'Example Light',
      icon: 'mdi:lightbulb',
      color: 'amber',
      card_type: 'slider'
    };
  }

  async connectedCallback() {
    if (this._hassConnected) return;
    this._hassConnected = true;

    if (this.config && this.config.entity) {
      await this.updateEntity();
    }
  }

  disconnectedCallback() {
    this._hassConnected = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (hass && this.entityId) {
      this.updateEntity();
    }
  }

  async updateEntity() {
    if (!this._hass || !this.entityId) return;

    const entity = this._hass.states[this.entityId];
    if (!entity) return;

    this.entity = entity;
    this.isOn = entity.state !== 'off' && entity.state !== 'unavailable';
    this.value = this.isOn ? (entity.attributes.brightness || 100) : 0;

    this.updateCard();
  }

  updateCard() {
    if (!this.shadowRoot) return;

    const card = this.shadowRoot.querySelector('.smart-card');
    if (!card) return;

    const stateIndicator = this.shadowRoot.querySelector('.state-indicator');
    const iconContainer = this.shadowRoot.querySelector('.icon-container');
    const title = this.shadowRoot.querySelector('.card-title');
    const subtitle = this.shadowRoot.querySelector('.card-subtitle');
    const sliderContainer = this.shadowRoot.querySelector('.slider-container');
    const sliderFill = this.shadowRoot.querySelector('.slider-fill');
    const valueDisplay = this.shadowRoot.querySelector('.value-display');
    const bgGlow = this.shadowRoot.querySelector('.bg-glow');

    if (stateIndicator) {
      stateIndicator.className = `state-indicator w-2 h-2 rounded-full transition-colors duration-300 ${this.isOn ? this.colorMap[this.color].bg : 'bg-slate-700'}`;
    }

    if (iconContainer) {
      iconContainer.className = `icon-container w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 ${this.isOn ? `bg-gradient-to-br ${this.colorMap[this.color].gradient} text-white shadow-lg ${this.colorMap[this.color].glow}` : 'bg-white/5 text-slate-400'}`;
      const icon = iconContainer.querySelector('ha-icon');
      if (icon) {
        icon.classList.toggle('animate-pulse-slow', this.isOn);
      }
    }

    if (title) {
      title.className = `card-title font-semibold text-lg tracking-wide transition-colors ${this.isOn ? 'text-white' : 'text-slate-300'}`;
    }

    if (subtitle) {
      const stateText = this.isOn ? (this.cardType === 'slider' ? 'Active' : 'On') : 'Standby';
      subtitle.textContent = this.config.subtitle || stateText;
    }

    if (sliderContainer) {
      if (this.cardType === 'slider' && this.isOn) {
        sliderContainer.classList.remove('opacity-0', 'max-h-0');
        sliderContainer.classList.add('opacity-100', 'max-h-20');
      } else {
        sliderContainer.classList.add('opacity-0', 'max-h-0');
        sliderContainer.classList.remove('opacity-100', 'max-h-20');
      }
    }

    if (sliderFill && this.isOn) {
      const brightnessValue = this.entity?.attributes?.brightness || this.value;
      const percentage = Math.round((brightnessValue / 255) * 100);
      sliderFill.style.width = `${percentage}%`;
    }

    if (valueDisplay && this.isOn) {
      const brightnessValue = this.entity?.attributes?.brightness || this.value;
      const percentage = Math.round((brightnessValue / 255) * 100);
      valueDisplay.textContent = `${percentage}%`;
    }

    if (bgGlow) {
      bgGlow.className = `bg-glow absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] transition-all duration-700 opacity-0 ${this.isOn ? 'opacity-20' : ''} ${this.colorMap[this.color].bg}`;
    }
  }

  handleToggle(e) {
    if (e.target.classList.contains('slider-input')) return;

    if (!this._hass || !this.entityId) return;

    const newState = this.isOn ? 'off' : 'on';
    this._hass.callService('homeassistant', 'toggle', {
      entity_id: this.entityId
    });
  }

  handleSliderChange(e) {
    if (!this._hass || !this.entityId) return;

    const percentage = parseInt(e.target.value);
    const brightness = Math.round((percentage / 100) * 255);

    this._hass.callService('light', 'turn_on', {
      entity_id: this.entityId,
      brightness: brightness
    });
  }

  get colorMap() {
    return {
      amber: {
        bg: 'bg-amber-500',
        text: 'text-amber-400',
        glow: 'shadow-amber-500/50',
        gradient: 'from-amber-400 to-orange-500'
      },
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-400',
        glow: 'shadow-blue-500/50',
        gradient: 'from-blue-400 to-cyan-500'
      },
      emerald: {
        bg: 'bg-emerald-500',
        text: 'text-emerald-400',
        glow: 'shadow-emerald-500/50',
        gradient: 'from-emerald-400 to-teal-500'
      },
      violet: {
        bg: 'bg-violet-500',
        text: 'text-violet-400',
        glow: 'shadow-violet-500/50',
        gradient: 'from-violet-400 to-purple-500'
      },
      cyan: {
        bg: 'bg-cyan-500',
        text: 'text-cyan-400',
        glow: 'shadow-cyan-500/50',
        gradient: 'from-cyan-400 to-sky-500'
      },
      rose: {
        bg: 'bg-rose-500',
        text: 'text-rose-400',
        glow: 'shadow-rose-500/50',
        gradient: 'from-rose-400 to-pink-500'
      }
    };
  }

  render() {
    const theme = this.colorMap[this.color];
    const name = this.config.name || 'Unknown';
    const icon = this.config.icon || 'mdi:lightbulb';

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .smart-card {
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(24px);
          background: rgba(15, 23, 42, 0.6);
          min-height: 140px;
        }

        .smart-card:hover {
          border-color: rgba(255, 255, 255, 0.1);
        }

        .smart-card:active {
          transform: scale(0.98);
        }

        .bg-glow {
          pointer-events: none;
        }

        .icon-container ha-icon {
          --mdc-icon-size: 24px;
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .slider-container {
          transition: all 0.5s ease;
        }

        .slider-container.opacity-0 {
          opacity: 0;
          max-height: 0;
          overflow: hidden;
        }

        .slider-container.opacity-100 {
          opacity: 1;
          max-height: 80px;
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
        }

        .slider-fill {
          transition: width 0.3s ease;
        }
      </style>

      <div class="smart-card">
        <div class="bg-glow ${theme.bg}"></div>

        <div class="flex flex-col h-full justify-between relative z-10">
          <div class="flex justify-between items-start">
            <div class="icon-container bg-white/5 text-slate-400">
              <ha-icon icon="${icon}"></ha-icon>
            </div>
            <div class="flex flex-col items-end">
              <div class="state-indicator bg-slate-700"></div>
            </div>
          </div>

          <div class="mt-6">
            <h3 class="card-title font-semibold text-lg tracking-wide transition-colors text-slate-300">
              ${name}
            </h3>
            <p class="card-subtitle text-sm text-slate-500 font-medium">
              Standby
            </p>
          </div>

          ${this.cardType === 'slider' ? `
            <div class="slider-container opacity-0 mt-4 h-12 bg-slate-950/50 rounded-2xl flex items-center px-1 relative overflow-hidden">
              <div class="slider-fill absolute left-0 top-0 bottom-0 bg-white/10" style="width: 0%"></div>
              <input
                type="range"
                min="0"
                max="100"
                value="100"
                class="slider-input"
              />
              <div class="w-full flex justify-between items-center px-3 z-10 pointer-events-none">
                <ha-icon icon="${icon}" class="text-slate-500" style="--mdc-icon-size: 14px;"></ha-icon>
                <span class="value-display text-xs font-bold text-white/80">100%</span>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Add event listeners
    const card = this.shadowRoot.querySelector('.smart-card');
    card.addEventListener('click', this.handleToggle.bind(this));

    const slider = this.shadowRoot.querySelector('.slider-input');
    if (slider) {
      slider.addEventListener('input', this.handleSliderChange.bind(this));
    }
  }
}

customElements.define('smart-glass-card', SmartGlassCard);

// For backward compatibility
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'smart-glass-card',
  name: 'Smart Glass Card',
  preview: true,
  description: 'A modern glassmorphism card with smooth animations'
});
