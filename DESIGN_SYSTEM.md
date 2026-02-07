# Design System Documentation

## Overview

This design system implements a **2-level token architecture** (Raw → Semantic) with a comprehensive button component system pulled from Figma designs.

## Architecture

```
Raw Tokens (Level 1)        →        Semantic Tokens (Level 2)        →        Components
light.tokens.json                    semantic.tokens.json                      button.css
(Base colors)                        (Component-specific)                      (Implementation)
```

## Token System

### Level 1: Raw Tokens

Located in: `assets/designSystem/light.tokens.json`

Raw tokens define the base color palette with no semantic meaning:

- **Grey Scale**: `grey-white`, `grey-black`, `grey-10` through `grey-100`
- **Blue**: `blue-10` through `blue-100`
- **Green**: `green-10` through `green-100`
- **Red**: `red-10` through `red-100`
- **Yellow**: `yellow-10` through `yellow-100`

Example:
```json
{
  "grey": {
    "black": {
      "$type": "color",
      "$value": { "hex": "#000000" }
    }
  }
}
```

### Level 2: Semantic Tokens

Located in: `assets/designSystem/semantic.tokens.json`

Semantic tokens map raw tokens to component-specific usage:

- **Button Tokens**
  - Fill variant: `background`, `content`, `backgroundDisabled`, `contentDisabled`
  - Outline variant: `border`, `borderSecondary`, `borderDisabled`, `content`, `contentDisabled`
  - Text-only variant: `content`, `contentDisabled`
  - Interaction states: `backgroundHover`, `backgroundPressed`

- **Radius Tokens**: `small` (6px), `medium` (8px)
- **Spacing Tokens**: Size-specific padding and gaps
- **Typography Tokens**: Font styles for each size

### CSS Variables

Located in: `assets/designSystem/tokens.css`

All tokens are exported as CSS custom properties:

```css
:root {
  /* Raw tokens */
  --color-grey-black: #000000;
  --color-grey-white: #FFFFFF;

  /* Semantic tokens */
  --button-fill-background: var(--color-grey-black);
  --button-fill-content: var(--color-grey-white);
}
```

## Button Component

### Configuration

Located in: `assets/designSystem/button.config.json`

Complete configuration for all button variants, sizes, and states stored as reusable data:

```json
{
  "variants": { "fill", "outline", "textOnly" },
  "sizes": { "small", "medium", "large" },
  "states": { "enabled", "hovered", "pressed", "disabled" }
}
```

### Variants

#### Fill
- **Purpose**: Primary actions
- **States**: Enabled (black bg), Hover (20% white overlay), Pressed (30% white overlay), Disabled (grey bg)
- **Usage**: `<button class="btn btn-fill btn-large">Label</button>`

#### Outline
- **Purpose**: Secondary actions
- **States**: Enabled (grey border), Hover (light bg + black border), Pressed (darker bg), Disabled (light grey)
- **Usage**: `<button class="btn btn-outline btn-medium">Label</button>`

#### Text Only
- **Purpose**: Tertiary actions
- **States**: Enabled (transparent), Hover (light bg), Pressed (darker bg), Disabled (grey text)
- **Usage**: `<button class="btn btn-text-only btn-small">Label</button>`

### Sizes

| Size | Padding | Border Radius | Font Size | Line Height | Icon Size |
|------|---------|---------------|-----------|-------------|-----------|
| Small | 4px 8px 4px 6px | 6px | 13px | 22px | 20px |
| Medium | 6px 12px 6px 8px | 8px | 14px | 24px | 20px |
| Large | 8px 16px 8px 12px | 8px | 16px | 26px | 24px |

### States

- **Enabled**: Default interactive state
- **Hovered**: Mouse hover state with background overlay
- **Pressed**: Active/pressed state with stronger overlay
- **Disabled**: Non-interactive state with reduced opacity

### Icon Support

Buttons support an optional leading icon:

```html
<button class="btn btn-fill btn-large">
  <span class="btn-icon">
    <svg>...</svg>
  </span>
  <span class="btn-label">Label</span>
</button>
```

## Usage

### HTML + CSS (Recommended for static buttons)

```html
<!-- Include design tokens and button styles -->
<link rel="stylesheet" href="assets/designSystem/tokens.css">
<link rel="stylesheet" href="assets/components/button.css">

<!-- Use button with classes -->
<button class="btn btn-fill btn-large">
  <span class="btn-label">Click me</span>
</button>
```

### JavaScript API (Recommended for dynamic buttons)

```javascript
// Include button component
<script src="assets/components/button.js"></script>

// Create button
const button = new Button({
  label: 'Click me',
  variant: 'fill',      // 'fill', 'outline', 'text-only'
  size: 'large',        // 'small', 'medium', 'large'
  leadingIcon: '<svg>...</svg>',
  disabled: false,
  onClick: (event) => {
    console.log('Clicked!');
  }
});

// Render to DOM
document.getElementById('container').appendChild(button.render());

// Update button
button.update({ label: 'Updated', disabled: true });
```

## Files Structure

```
assets/
├── designSystem/
│   ├── light.tokens.json       # Raw color tokens (Level 1)
│   ├── semantic.tokens.json    # Semantic tokens (Level 2)
│   ├── button.config.json      # Button configuration
│   └── tokens.css              # CSS variables
└── components/
    ├── button.css              # Button styles
    └── button.js               # Button component class
```

## Examples

See `button-examples.html` for:
- All button variants (fill, outline, text-only)
- All sizes (small, medium, large)
- All states (enabled, hovered, pressed, disabled)
- Icon support
- JavaScript API examples
- HTML structure examples

## Design System Benefits

1. **Maintainability**: Change colors once in raw tokens, propagates everywhere
2. **Consistency**: All components use the same semantic tokens
3. **Scalability**: Easy to add new components or variants
4. **Type Safety**: Configuration stored as JSON for validation
5. **Reusability**: All variants and sizes stored as reusable data
6. **Documentation**: Clear mapping from raw to semantic to component

## Figma Integration

This button component was generated from Figma Design:
- **File**: draft-workspace
- **Node**: 37:828
- All interactions, states, and variants pulled directly from Figma component set
- Design tokens extracted from Figma variables

## Next Steps

To add more components:
1. Extract raw tokens from Figma (already done)
2. Create semantic tokens in `semantic.tokens.json`
3. Add CSS variables to `tokens.css`
4. Create component configuration JSON
5. Implement component CSS and JS
6. Update this documentation

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Custom Properties required
- ES6 JavaScript features used
