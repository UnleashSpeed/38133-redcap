# RedCap RRM Educational Website - Design Specification
## Version 1.0.0 | 3GPP TS 38.133 V19.2.0 Compliant

---

## 1. Design Philosophy

### 1.1 Core Principles
- **Clarity First**: Complex 3GPP specifications presented with intuitive visual hierarchy
- **Joyful Learning**: Gamification elements that make technical education engaging
- **Professional Authority**: Nokia.com-inspired corporate-tech aesthetic
- **Accessibility**: WCAG 2.1 AA compliance throughout

### 1.2 Brand Voice
- **Technical but Approachable**: Precise terminology with explanatory tooltips
- **Encouraging**: Progress indicators and achievement celebrations
- **Authoritative**: Direct citations to 3GPP specifications

---

## 2. Color System

### 2.1 Primary Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--nokia-blue` | #005AFF | rgb(0, 90, 255) | Primary buttons, links, accents |
| `--nokia-dark` | #124191 | rgb(18, 65, 145) | Headers, emphasis, hover states |
| `--nokia-deep` | #001135 | rgb(0, 17, 53) | Footer, dark sections |
| `--nokia-black` | #0A0A0A | rgb(10, 10, 10) | Text primary |

### 2.2 Secondary Palette (Signal Strength)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--signal-strong` | #00C853 | rgb(0, 200, 83) | Excellent signal, success states |
| `--signal-good` | #64DD17 | rgb(100, 221, 23) | Good signal |
| `--signal-fair` | #FFD600 | rgb(255, 214, 0) | Fair signal, warnings |
| `--signal-poor` | #FF6D00 | rgb(255, 109, 0) | Poor signal |
| `--signal-lost` | #FF1744 | rgb(255, 23, 68) | Out of sync, errors |

### 2.3 Neutral Palette (Light Mode)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--bg-primary` | #FFFFFF | rgb(255, 255, 255) | Main background |
| `--bg-secondary` | #F8FAFC | rgb(248, 250, 252) | Card backgrounds |
| `--bg-tertiary` | #F1F5F9 | rgb(241, 245, 249) | Section alternates |
| `--text-primary` | #0F172A | rgb(15, 23, 42) | Primary text |
| `--text-secondary` | #475569 | rgb(71, 85, 105) | Secondary text |
| `--text-tertiary` | #94A3B8 | rgb(148, 163, 184) | Placeholder, disabled |
| `--border-default` | #E2E8F0 | rgb(226, 232, 240) | Default borders |
| `--border-hover` | #CBD5E1 | rgb(203, 213, 225) | Hover borders |
| `--border-focus` | #005AFF | rgb(0, 90, 255) | Focus rings |

### 2.4 Neutral Palette (Dark Mode)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--dm-bg-primary` | #0A0F1A | rgb(10, 15, 26) | Main background |
| `--dm-bg-secondary` | #111827 | rgb(17, 24, 39) | Card backgrounds |
| `--dm-text-primary` | #F8FAFC | rgb(248, 250, 252) | Primary text |
| `--dm-text-secondary` | #CBD5E1 | rgb(203, 213, 225) | Secondary text |
| `--dm-border-default` | #334155 | rgb(51, 65, 85) | Default borders |
| `--dm-border-focus` | #60A5FA | rgb(96, 165, 250) | Focus rings |

### 2.5 Accent Colors (Gamification)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--badge-bronze` | #CD7F32 | rgb(205, 127, 50) | Bronze achievements |
| `--badge-silver` | #C0C0C0 | rgb(192, 192, 192) | Silver achievements |
| `--badge-gold` | #FFD700 | rgb(255, 215, 0) | Gold achievements |
| `--badge-platinum` | #E5E4E2 | rgb(229, 228, 226) | Platinum achievements |
| `--xp-primary` | #8B5CF6 | rgb(139, 92, 246) | XP points |
| `--streak-fire` | #F97316 | rgb(249, 115, 22) | Daily streaks |

### 2.6 Data Visualization Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--data-blue` | #005AFF | rgb(0, 90, 255) | Primary data series |
| `--data-cyan` | #06B6D4 | rgb(6, 182, 212) | Secondary data series |
| `--data-purple` | #8B5CF6 | rgb(139, 92, 246) | Tertiary data series |
| `--data-pink` | #EC4899 | rgb(236, 72, 153) | Quaternary data series |
| `--data-teal` | #14B8A6 | rgb(20, 184, 166) | Fifth data series |
| `--data-orange` | #F97316 | rgb(249, 115, 22) | Sixth data series |

---

## 3. Typography System

### 3.1 Font Families

```css
--font-primary: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", "Consolas", monospace;
--font-display: "Inter", sans-serif;
```

### 3.2 Type Scale

| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Display XL | 72px / 4.5rem | 800 | 1.0 | -0.02em | Hero headlines |
| Display L | 56px / 3.5rem | 700 | 1.1 | -0.02em | Section heroes |
| H1 | 48px / 3rem | 700 | 1.15 | -0.01em | Page titles |
| H2 | 36px / 2.25rem | 600 | 1.2 | -0.01em | Section headers |
| H3 | 28px / 1.75rem | 600 | 1.3 | 0 | Subsection headers |
| H4 | 24px / 1.5rem | 600 | 1.35 | 0 | Card titles |
| H5 | 20px / 1.25rem | 600 | 1.4 | 0 | Small headers |
| H6 | 18px / 1.125rem | 600 | 1.4 | 0 | Labels |
| Body Large | 18px / 1.125rem | 400 | 1.6 | 0 | Lead paragraphs |
| Body | 16px / 1rem | 400 | 1.6 | 0 | Default text |
| Body Small | 14px / 0.875rem | 400 | 1.5 | 0 | Secondary text |
| Caption | 12px / 0.75rem | 500 | 1.4 | 0.01em | Labels, captions |
| Overline | 11px / 0.6875rem | 600 | 1.2 | 0.08em | Uppercase labels |
| Code | 14px / 0.875rem | 400 | 1.6 | 0 | Monospace code |

### 3.3 Responsive Typography

| Breakpoint | Display XL | Display L | H1 | H2 | H3 |
|------------|------------|-----------|-----|-----|-----|
| Desktop (>=1280px) | 72px | 56px | 48px | 36px | 28px |
| Tablet (>=768px) | 56px | 44px | 40px | 32px | 26px |
| Mobile (<768px) | 40px | 32px | 32px | 26px | 22px |

### 3.4 3GPP Specification Citations

```css
.spec-citation {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--nokia-blue);
  background: rgba(0, 90, 255, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.02em;
}
```

---

## 4. Spacing System

### 4.1 Base Unit: 4px (0.25rem)

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--space-0` | 0 | 0px | None |
| `--space-1` | 0.25rem | 4px | Tight gaps |
| `--space-2` | 0.5rem | 8px | Compact spacing |
| `--space-3` | 0.75rem | 12px | Small gaps |
| `--space-4` | 1rem | 16px | Default spacing |
| `--space-5` | 1.25rem | 20px | Medium gaps |
| `--space-6` | 1.5rem | 24px | Component padding |
| `--space-8` | 2rem | 32px | Section gaps |
| `--space-10` | 2.5rem | 40px | Large gaps |
| `--space-12` | 3rem | 48px | Section padding |
| `--space-16` | 4rem | 64px | Major sections |
| `--space-20` | 5rem | 80px | Hero spacing |
| `--space-24` | 6rem | 96px | Page sections |
| `--space-32` | 8rem | 128px | Major dividers |

### 4.2 Section Spacing

| Element | Padding Top | Padding Bottom |
|---------|-------------|----------------|
| Hero Section | 120px | 120px |
| Standard Section | 80px | 80px |
| Compact Section | 48px | 48px |
| Footer | 64px | 32px |

### 4.3 Container Spacing

```css
--container-max: 1280px;
--container-padding: 24px;
--container-padding-lg: 32px;
--container-padding-xl: 48px;
```

### 4.4 Grid System (12-Column)

```css
--grid-columns: 12;
--grid-gap: 24px;
--grid-gap-md: 20px;
--grid-gap-sm: 16px;
```

---

## 5. Component Library

### 5.1 Buttons

**Primary Button:**
```css
.btn-primary {
  background: var(--nokia-blue);
  color: white;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-primary:hover {
  background: var(--nokia-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 90, 255, 0.3);
}
.btn-primary:active {
  transform: translateY(0);
}
.btn-primary:focus-visible {
  outline: 3px solid rgba(0, 90, 255, 0.4);
  outline-offset: 2px;
}
```

**Secondary Button:**
```css
.btn-secondary {
  background: transparent;
  color: var(--nokia-blue);
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid var(--nokia-blue);
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-secondary:hover {
  background: rgba(0, 90, 255, 0.08);
}
```

**Button Sizes:**
| Size | Padding | Font Size | Height |
|------|---------|-----------|--------|
| Small | 8px 16px | 14px | 32px |
| Medium | 12px 24px | 16px | 44px |
| Large | 16px 32px | 18px | 56px |

### 5.2 Cards

**Standard Card:**
```css
.card {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--border-default);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--border-hover);
}
```

**Interactive Card:**
```css
.card-interactive {
  cursor: pointer;
}
.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}
```

**Feature Card:**
```css
.card-feature {
  padding: 32px;
  border-radius: 20px;
}
.card-feature__icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--nokia-blue), var(--nokia-dark));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
```

**Data Card:**
```css
.card-data {
  padding: 24px;
  border-radius: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
}
.card-data__value {
  font-size: 36px;
  font-weight: 700;
  color: var(--nokia-blue);
  line-height: 1;
}
.card-data__label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 8px;
}
```

### 5.3 Forms & Inputs

**Text Input:**
```css
.input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-family: var(--font-primary);
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 2px solid var(--border-default);
  border-radius: 8px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.input:hover {
  border-color: var(--border-hover);
}
.input:focus {
  border-color: var(--border-focus);
  outline: none;
  box-shadow: 0 0 0 4px rgba(0, 90, 255, 0.1);
}
.input::placeholder {
  color: var(--text-tertiary);
}
```

**Label:**
```css
.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.label__required {
  color: var(--signal-lost);
  margin-left: 4px;
}
```

### 5.4 Range Slider (for RLM simulator)

```css
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, 
    var(--signal-strong) 0%, 
    var(--signal-fair) 50%, 
    var(--signal-lost) 100%
  );
  outline: none;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 3px solid var(--nokia-blue);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 150ms ease;
}
.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}
```

### 5.5 Toggle Switch

```css
.toggle {
  position: relative;
  width: 52px;
  height: 28px;
}
.toggle__input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle__slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--border-default);
  border-radius: 28px;
  transition: background 200ms ease;
}
.toggle__slider::before {
  content: "";
  position: absolute;
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.toggle__input:checked + .toggle__slider {
  background: var(--nokia-blue);
}
.toggle__input:checked + .toggle__slider::before {
  transform: translateX(24px);
}
```

### 5.6 Three-Mode Toggle (Fun/Researcher/Purist)

```css
.mode-toggle {
  display: inline-flex;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 4px;
  border: 1px solid var(--border-default);
}
.mode-toggle__option {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--text-secondary);
}
.mode-toggle__option:hover {
  color: var(--text-primary);
}
.mode-toggle__option--active {
  background: var(--nokia-blue);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 90, 255, 0.3);
}
```

### 5.7 Tables

**Data Table:**
```css
.table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--border-default);
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.table__head {
  background: var(--bg-secondary);
}
.table__th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-default);
}
.table__td {
  padding: 16px;
  border-bottom: 1px solid var(--border-default);
  color: var(--text-secondary);
}
.table__tr:hover .table__td {
  background: var(--bg-secondary);
}
```

**3GPP Specification Table:**
```css
.table-spec {
  font-family: var(--font-mono);
  font-size: 13px;
}
.table-spec__th {
  background: var(--nokia-dark);
  color: white;
}
.table-spec__row--highlight {
  background: rgba(0, 90, 255, 0.05);
}
```

### 5.8 Badges & Labels

**Status Badge:**
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 9999px;
}
.badge--success {
  background: rgba(0, 200, 83, 0.15);
  color: var(--signal-strong);
}
.badge--warning {
  background: rgba(255, 214, 0, 0.15);
  color: #B7950B;
}
.badge--error {
  background: rgba(255, 23, 68, 0.15);
  color: var(--signal-lost);
}
.badge--info {
  background: rgba(0, 90, 255, 0.15);
  color: var(--nokia-blue);
}
```

**Achievement Badge:**
```css
.badge-achievement {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.badge-achievement--bronze {
  background: linear-gradient(135deg, #CD7F32, #8B6914);
  box-shadow: 0 4px 12px rgba(205, 127, 50, 0.4);
}
.badge-achievement--silver {
  background: linear-gradient(135deg, #C0C0C0, #808080);
  box-shadow: 0 4px 12px rgba(192, 192, 192, 0.4);
}
.badge-achievement--gold {
  background: linear-gradient(135deg, #FFD700, #B8860B);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}
.badge-achievement--platinum {
  background: linear-gradient(135deg, #E5E4E2, #A0A0A0);
  box-shadow: 0 4px 12px rgba(229, 228, 226, 0.4);
}
```

### 5.9 Progress Indicators

**Linear Progress:**
```css
.progress {
  width: 100%;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}
.progress__bar {
  height: 100%;
  background: linear-gradient(90deg, var(--nokia-blue), var(--signal-strong));
  border-radius: 4px;
  transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Circular Progress:**
```css
.progress-circle {
  width: 80px;
  height: 80px;
}
.progress-circle__track {
  fill: none;
  stroke: var(--bg-secondary);
  stroke-width: 8;
}
.progress-circle__fill {
  fill: none;
  stroke: var(--nokia-blue);
  stroke-width: 8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Step Indicator:**
```css
.steps {
  display: flex;
  align-items: center;
  gap: 8px;
}
.steps__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--border-default);
}
.steps__dot--active {
  background: var(--nokia-blue);
  box-shadow: 0 0 0 4px rgba(0, 90, 255, 0.2);
}
.steps__dot--completed {
  background: var(--signal-strong);
}
.steps__line {
  width: 32px;
  height: 2px;
  background: var(--border-default);
}
.steps__line--completed {
  background: var(--signal-strong);
}
```

### 5.10 Tooltips

```css
.tooltip {
  position: relative;
}
.tooltip__content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  padding: 8px 12px;
  background: var(--nokia-deep);
  color: white;
  font-size: 13px;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 200ms ease;
  z-index: 100;
}
.tooltip__content::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--nokia-deep);
}
.tooltip:hover .tooltip__content {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-4px);
}
```

### 5.11 Modals

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 300ms ease;
}
.modal-overlay--open {
  opacity: 1;
  visibility: visible;
}
.modal {
  background: var(--bg-primary);
  border-radius: 20px;
  width: 90%;
  max-width: 560px;
  max-height: 90vh;
  overflow: hidden;
  transform: scale(0.95) translateY(20px);
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-overlay--open .modal {
  transform: scale(1) translateY(0);
}
.modal__header {
  padding: 24px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal__title {
  font-size: 20px;
  font-weight: 600;
}
.modal__body {
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
}
.modal__footer {
  padding: 0 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
```

### 5.12 Navigation

```css
.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-default);
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 0 24px;
}
.nav-header__logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--nokia-blue);
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-header__link {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: 8px;
  transition: all 200ms ease;
}
.nav-header__link:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}
.nav-header__link--active {
  color: var(--nokia-blue);
  background: rgba(0, 90, 255, 0.08);
}
```

---

## 6. Animation Specifications

### 6.1 Easing Functions

| Name | Value | Usage |
|------|-------|-------|
| `--ease-default` | cubic-bezier(0.4, 0, 0.2, 1) | Standard transitions |
| `--ease-in` | cubic-bezier(0.4, 0, 1, 1) | Elements exiting |
| `--ease-out` | cubic-bezier(0, 0, 0.2, 1) | Elements entering |
| `--ease-bounce` | cubic-bezier(0.34, 1.56, 0.64, 1) | Playful animations |
| `--ease-spring` | cubic-bezier(0.175, 0.885, 0.32, 1.275) | Elastic effects |

### 6.2 Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Micro-interactions |
| `--duration-normal` | 200ms | Standard transitions |
| `--duration-slow` | 300ms | Complex animations |
| `--duration-slower` | 500ms | Page transitions |
| `--duration-slowest` | 800ms | Hero animations |

### 6.3 Hero Section Animations

**Staggered Text Reveal:**
```css
@keyframes hero-text-reveal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.hero__title-word {
  animation: hero-text-reveal 600ms var(--ease-out) forwards;
  animation-delay: calc(var(--word-index) * 100ms);
  opacity: 0;
}
```

**Floating Signal Waves:**
```css
@keyframes signal-wave {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
.signal-wave {
  animation: signal-wave 2s ease-out infinite;
}
.signal-wave:nth-child(2) { animation-delay: 0.5s; }
.signal-wave:nth-child(3) { animation-delay: 1s; }
```

**Pulse Animation:**
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
}
.pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

### 6.4 Scroll Animations

**Fade In Up:**
```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-on-scroll--visible {
  animation: fade-in-up 600ms var(--ease-out) forwards;
}
```

### 6.5 Gamification Animations

**Confetti Burst:**
```css
@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
.confetti {
  position: fixed;
  width: 10px;
  height: 10px;
  animation: confetti-fall 3s ease-out forwards;
}
```

**XP Gain Animation:**
```css
@keyframes xp-float {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  20% {
    opacity: 1;
    transform: translateY(-20px) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(1);
  }
}
.xp-gain {
  position: absolute;
  color: var(--xp-primary);
  font-weight: 700;
  font-size: 18px;
  animation: xp-float 1.5s ease-out forwards;
}
```

**Badge Unlock:**
```css
@keyframes badge-unlock {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  70% {
    transform: scale(0.95) rotate(-5deg);
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}
.badge-unlock {
  animation: badge-unlock 800ms var(--ease-spring) forwards;
}
```

### 6.6 Loading Animations

**Spinner:**
```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border-default);
  border-top-color: var(--nokia-blue);
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}
```

**Skeleton Shimmer:**
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 25%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## 7. Interactive Components - Detailed Specifications

### 7.1 RLM Signal Degradation Simulator

**Component Structure:**
```
RLMSimulator
├── Header (title + spec citation)
├── Visualization Area
│   ├── Signal Wave Animation
│   ├── Sync Status Indicator
│   └── Out-of-Sync Counter
├── Controls
│   ├── SNR Slider (-10dB to +30dB)
│   ├── Qout Threshold Display
│   ├── Qin Threshold Display
│   └── Reset Button
└── Metrics Panel
    ├── Current RSRP
    ├── Current SINR
    └── Sync State
```

**Visual Specifications:**
- Container: border-radius: 20px, padding: 32px
- Signal color transitions:
  - > 6dB: --signal-strong (#00C853)
  - 0-6dB: --signal-fair (#FFD600)
  - < 0dB: --signal-lost (#FF1744)
- Sync indicator: 24px circle with pulse animation

**Interaction Behaviors:**
- Slider drag: Real-time waveform update (60fps)
- Threshold crossing: 200ms color transition
- Out-of-sync: Counter increments with bounce animation
- Reset: Fade out/in transition (300ms)

### 7.2 Measurement Gap Visualizer

**Component Structure:**
```
GapVisualizer
├── Timeline Canvas
│   ├── Time Axis (ms)
│   ├── Gap Pattern Bars
│   ├── Measurement Windows
│   └── Current Position Indicator
├── Pattern Selector
│   ├── Per-UE Gap (0-3)
│   ├── Per-FR1 Gap (0-3)
│   └── Custom Pattern Builder
├── Parameters Panel
│   ├── MGRP Input
│   ├── MGL Input
│   └── Repetition Input
└── CSSF Calculator
    ├── Formula Display
    ├── Live Result
    └── 3GPP Reference
```

**Visual Specifications:**
- Timeline height: 200px
- Gap bars: --nokia-blue at 60% opacity
- Measurement windows: --signal-strong border
- Draggable handles: 16px circles with shadow

**Drag Interaction:**
```css
.gap-handle {
  width: 16px;
  height: 16px;
  background: white;
  border: 3px solid var(--nokia-blue);
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.gap-handle:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(0, 90, 255, 0.3);
}
.gap-handle:active {
  cursor: grabbing;
  transform: scale(1.1);
}
```

### 7.3 Live Formula Calculator

**Component Structure:**
```
FormulaCalculator
├── Formula Display (LaTeX rendered)
├── Variable Inputs
│   ├── Input with unit label
│   ├── Range slider (linked)
│   └── Preset buttons
├── Calculate Button
├── Result Display
│   ├── Main result
│   ├── Unit
│   └── Confidence indicator
└── Explanation Panel
```

**Visual Specifications:**
- Formula: font-family: var(--font-mono), font-size: 18px
- Variables: Highlighted with --nokia-blue background
- Result: font-size: 32px, font-weight: 700

**CSSF Formula:**
```
CSSF = ceil(2 * MGRP / (MGRP - MGL))
```

### 7.4 1Rx vs 2Rx Comparison Toggle

**Component Structure:**
```
RxComparison
├── Toggle Header
├── Comparison Cards (side by side)
│   ├── 1Rx Card
│   └── 2Rx Card
├── Performance Chart
└── Use Case Recommendations
```

**Visual Specifications:**
- Cards: Equal width, gap: 24px
- Active card: --nokia-blue border, elevated shadow
- Inactive card: --border-default, reduced opacity (0.7)
- Toggle animation: 300ms slide transition

### 7.5 Quiz Component

**Component Structure:**
```
Quiz
├── Progress Bar
├── Question Counter
├── Question Text
├── Answer Options
├── Explanation Panel (post-answer)
├── Navigation
└── Score Display
```

**Answer Option States:**
```css
.quiz-option {
  padding: 16px 20px;
  border: 2px solid var(--border-default);
  border-radius: 12px;
  cursor: pointer;
  transition: all 200ms ease;
}
.quiz-option:hover {
  border-color: var(--border-hover);
  background: var(--bg-secondary);
}
.quiz-option--selected {
  border-color: var(--nokia-blue);
  background: rgba(0, 90, 255, 0.05);
}
.quiz-option--correct {
  border-color: var(--signal-strong);
  background: rgba(0, 200, 83, 0.1);
}
.quiz-option--incorrect {
  border-color: var(--signal-lost);
  background: rgba(255, 23, 68, 0.1);
}
```

**Confetti Trigger:**
- Trigger: 100% quiz completion
- Particle count: 100-150
- Colors: Primary palette + gold
- Duration: 3 seconds

### 7.6 Progress Tracking Badges

**Component Structure:**
```
BadgeGrid
├── Section Header
├── Badge Grid (3 columns)
│   └── Badge Card
│       ├── Badge Icon (locked/unlocked)
│       ├── Badge Name
│       ├── Description
│       ├── Progress Bar
│       └── Unlock Criteria
└── Achievement Summary
```

**Badge States:**
```css
.badge-card {
  padding: 24px;
  border-radius: 16px;
  border: 2px solid var(--border-default);
  transition: all 300ms ease;
}
.badge-card--locked {
  opacity: 0.6;
  filter: grayscale(0.8);
}
.badge-card--unlocked {
  border-color: var(--badge-gold);
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), transparent);
}
.badge-card--newly-unlocked {
  animation: badge-unlock 800ms var(--ease-spring);
}
```

### 7.7 AI Chatbot Interface

**Component Structure:**
```
Chatbot
├── Toggle Button (floating)
├── Chat Window
│   ├── Header
│   ├── Messages Area
│   └── Input Area
└── Suggestion Chips
```

**Visual Specifications:**
- Toggle button: 56px circle, fixed bottom-right
- Chat window: 400px width, 600px max height
- User message: --nokia-blue background, right-aligned
- Bot message: --bg-secondary background, left-aligned

**Message Bubbles:**
```css
.message {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
}
.message--user {
  background: var(--nokia-blue);
  color: white;
  border-bottom-right-radius: 4px;
  margin-left: auto;
}
.message--bot {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-bottom-left-radius: 4px;
}
```

**Typing Indicator:**
```css
.typing-dot {
  width: 8px;
  height: 8px;
  background: var(--text-tertiary);
  border-radius: 50%;
  animation: typing-bounce 1s ease-in-out infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-8px); }
}
```

---

## 8. Section Designs

### 8.1 Hero Section

**Layout:**
- Full viewport height (100vh)
- Centered content, max-width 900px
- Background: Gradient mesh animation
- Floating signal wave decorations

**Content Structure:**
```
Hero
├── Navigation Bar
├── Main Content (centered)
│   ├── Eyebrow Text ("3GPP TS 38.133 V19.2.0")
│   ├── Headline ("RedCap RRM")
│   ├── Subheadline
│   ├── CTA Buttons
│   └── Mode Toggle
└── Scroll Indicator
```

**Background Animation:**
```css
.hero-bg {
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(0, 90, 255, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(18, 65, 145, 0.06) 0%, transparent 50%),
    var(--bg-primary);
}
```

### 8.2 RLM Section (8.1B)

**Layout:**
- Two-column grid (60/40 split)
- Left: Interactive simulator
- Right: Educational content + spec table

### 8.3 Measurement Procedure Section (9.1A)

**Layout:**
- Full-width timeline visualization
- Control panel below
- Results sidebar

### 8.4 Idle Mobility Section (4.2B)

**Layout:**
- Vertical timeline
- Interactive cell reselection flow
- Parameter cards

### 8.5 Performance Accuracy Section (10.1A)

**Layout:**
- Three-column metric cards
- Heatmap visualization
- Accuracy tables

### 8.6 Interactive Tools Section

**Layout:**
- Grid of tool cards
- Each card links to specific tool

### 8.7 Gamification Section

**Layout:**
- User stats header
- Badge grid
- Progress overview

### 8.8 Beauty of RedCap Section

**Layout:**
- Full-width inspirational design
- Animated visualizations
- Quote cards

---

## 9. Responsive Design

### 9.1 Breakpoints

| Name | Min Width | Max Width | Target |
|------|-----------|-----------|--------|
| `sm` | 0px | 639px | Mobile |
| `md` | 640px | 767px | Large mobile |
| `lg` | 768px | 1023px | Tablet |
| `xl` | 1024px | 1279px | Small desktop |
| `2xl` | 1280px | - | Desktop |

### 9.2 Container Behavior

```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
}

@media (min-width: 640px) { .container { max-width: 640px; } }
@media (min-width: 768px) { .container { max-width: 768px; } }
@media (min-width: 1024px) { .container { max-width: 1024px; } }
@media (min-width: 1280px) { .container { max-width: 1280px; } }
```

### 9.3 Grid Adaptations

**Desktop (3 columns):**
```css
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
```

**Tablet (2 columns):**
```css
@media (max-width: 1023px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}
```

**Mobile (1 column):**
```css
@media (max-width: 767px) {
  .grid-3 {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
```

### 9.4 Touch Targets

Minimum touch target size: **44px x 44px**

```css
.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

---

## 10. Dark Mode Specifications

### 10.1 Color Mapping

| Light Mode | Dark Mode |
|------------|-----------|
| `--bg-primary` | `--dm-bg-primary` |
| `--bg-secondary` | `--dm-bg-secondary` |
| `--text-primary` | `--dm-text-primary` |
| `--text-secondary` | `--dm-text-secondary` |
| `--border-default` | `--dm-border-default` |

### 10.2 Dark Mode Specific Adjustments

**Reduced Shadows:**
```css
[data-theme="dark"] .card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
```

**Elevated Surfaces:**
```css
[data-theme="dark"] .card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
```

**Signal Colors (adjusted for dark):**
```css
[data-theme="dark"] {
  --signal-strong: #00E676;
  --signal-fair: #FFEA00;
  --signal-lost: #FF5252;
}
```

### 10.3 Theme Toggle

```css
.theme-toggle {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 200ms ease;
}
.theme-toggle:hover {
  background: var(--bg-secondary);
}
.theme-toggle__icon {
  width: 24px;
  height: 24px;
  transition: transform 300ms var(--ease-bounce);
}
.theme-toggle:hover .theme-toggle__icon {
  transform: rotate(15deg);
}
```

---

## 11. Accessibility Specifications

### 11.1 Color Contrast

All text must meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum contrast
- Large text: 3:1 minimum contrast
- UI components: 3:1 minimum contrast

### 11.2 Focus Indicators

```css
:focus-visible {
  outline: 3px solid var(--border-focus);
  outline-offset: 2px;
}
```

### 11.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 11.4 Screen Reader Support

```html
<!-- Skip link -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- ARIA labels -->
<button aria-label="Close modal">
  <span aria-hidden="true">x</span>
</button>

<!-- Live regions -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  Quiz score updated to 8 out of 10
</div>
```

---

## 12. Mode-Specific Content Display

### 12.1 Fun Explorer Mode

- Emoji icons throughout
- Gamification elements visible
- Simplified explanations
- Interactive demos emphasized
- Achievement notifications
- Playful animations

### 12.2 Researcher Mode

- Detailed technical content
- Full 3GPP citations
- Formula derivations
- Comparison tables
- Measurement accuracy data
- Professional tone

### 12.3 Spec Purist Mode

- Raw 3GPP tables
- Minimal styling
- Direct specification quotes
- Technical parameters
- No gamification
- Maximum information density

---

## Appendix A: Quick Reference

### Color Quick Reference
- Primary: `#005AFF`
- Dark: `#124191`
- Success: `#00C853`
- Warning: `#FFD600`
- Error: `#FF1744`

### Spacing Quick Reference
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Typography Quick Reference
- Display: 72px/800
- H1: 48px/700
- H2: 36px/600
- Body: 16px/400
- Caption: 12px/500

---

*Document Version: 1.0.0*
*Last Updated: 2024*
*3GPP Reference: TS 38.133 V19.2.0*
