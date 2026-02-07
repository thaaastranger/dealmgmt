/**
 * Button Component
 *
 * A comprehensive button component with support for:
 * - Multiple variants (fill, outline, text-only)
 * - Multiple sizes (small, medium, large)
 * - Multiple states (enabled, hovered, pressed, disabled)
 * - Optional leading icon
 * - Event handlers
 *
 * Usage:
 *   const button = new Button({
 *     label: 'Click me',
 *     variant: 'fill', // or 'outline', 'text-only'
 *     size: 'large', // or 'medium', 'small'
 *     leadingIcon: '<svg>...</svg>',
 *     disabled: false,
 *     onClick: (event) => { console.log('Clicked!'); }
 *   });
 *   document.body.appendChild(button.render());
 */

class Button {
  constructor(options = {}) {
    // Configuration from button.config.json
    this.config = {
      variants: ['fill', 'outline', 'text-only'],
      sizes: ['small', 'medium', 'large'],
      states: ['enabled', 'hovered', 'pressed', 'disabled']
    };

    // Default options
    this.options = {
      label: options.label || 'Label',
      variant: options.variant || 'fill',
      size: options.size || 'large',
      leadingIcon: options.leadingIcon || null,
      disabled: options.disabled || false,
      className: options.className || '',
      onClick: options.onClick || null,
      onHover: options.onHover || null,
      onFocus: options.onFocus || null,
      onBlur: options.onBlur || null,
      type: options.type || 'button',
      ariaLabel: options.ariaLabel || null,
      id: options.id || null
    };

    // Validate options
    this._validateOptions();

    // Create button element
    this.element = null;
  }

  /**
   * Validate configuration options
   * @private
   */
  _validateOptions() {
    if (!this.config.variants.includes(this.options.variant)) {
      console.warn(`Invalid variant "${this.options.variant}". Falling back to "fill".`);
      this.options.variant = 'fill';
    }

    if (!this.config.sizes.includes(this.options.size)) {
      console.warn(`Invalid size "${this.options.size}". Falling back to "large".`);
      this.options.size = 'large';
    }
  }

  /**
   * Generate CSS class names based on variant and size
   * @private
   * @returns {string} Space-separated class names
   */
  _getClassNames() {
    const classes = ['btn'];

    // Add variant class
    const variantClass = this.options.variant === 'text-only'
      ? 'btn-text-only'
      : `btn-${this.options.variant}`;
    classes.push(variantClass);

    // Add size class
    classes.push(`btn-${this.options.size}`);

    // Add custom classes
    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  /**
   * Create the icon element
   * @private
   * @returns {HTMLElement|null}
   */
  _createIconElement() {
    if (!this.options.leadingIcon) {
      return null;
    }

    const iconContainer = document.createElement('span');
    iconContainer.className = 'btn-icon';
    iconContainer.innerHTML = this.options.leadingIcon;

    return iconContainer;
  }

  /**
   * Create the label element
   * @private
   * @returns {HTMLElement}
   */
  _createLabelElement() {
    const label = document.createElement('span');
    label.className = 'btn-label';
    label.textContent = this.options.label;

    return label;
  }

  /**
   * Attach event listeners
   * @private
   */
  _attachEventListeners() {
    if (this.options.onClick) {
      this.element.addEventListener('click', (e) => {
        if (!this.options.disabled) {
          this.options.onClick(e, this);
        }
      });
    }

    if (this.options.onHover) {
      this.element.addEventListener('mouseenter', (e) => {
        if (!this.options.disabled) {
          this.options.onHover(e, this);
        }
      });
    }

    if (this.options.onFocus) {
      this.element.addEventListener('focus', (e) => {
        if (!this.options.disabled) {
          this.options.onFocus(e, this);
        }
      });
    }

    if (this.options.onBlur) {
      this.element.addEventListener('blur', (e) => {
        if (!this.options.disabled) {
          this.options.onBlur(e, this);
        }
      });
    }
  }

  /**
   * Render the button element
   * @returns {HTMLButtonElement}
   */
  render() {
    // Create button element
    this.element = document.createElement('button');
    this.element.type = this.options.type;
    this.element.className = this._getClassNames();
    this.element.disabled = this.options.disabled;

    // Set ARIA label if provided
    if (this.options.ariaLabel) {
      this.element.setAttribute('aria-label', this.options.ariaLabel);
    }

    // Set ID if provided
    if (this.options.id) {
      this.element.id = this.options.id;
    }

    // Add icon if provided
    const iconElement = this._createIconElement();
    if (iconElement) {
      this.element.appendChild(iconElement);
    }

    // Add label
    const labelElement = this._createLabelElement();
    this.element.appendChild(labelElement);

    // Attach event listeners
    this._attachEventListeners();

    return this.element;
  }

  /**
   * Update button properties
   * @param {Object} updates - Properties to update
   */
  update(updates = {}) {
    // Update options
    Object.assign(this.options, updates);

    // Validate updated options
    this._validateOptions();

    // Re-render if element exists
    if (this.element) {
      const parent = this.element.parentNode;
      const newElement = this.render();

      if (parent) {
        parent.replaceChild(newElement, this.element);
      }
    }
  }

  /**
   * Enable the button
   */
  enable() {
    this.update({ disabled: false });
  }

  /**
   * Disable the button
   */
  disable() {
    this.update({ disabled: true });
  }

  /**
   * Get the DOM element
   * @returns {HTMLButtonElement}
   */
  getElement() {
    return this.element;
  }

  /**
   * Destroy the button and remove event listeners
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.remove();
    }
    this.element = null;
  }
}

/**
 * Helper function to create a button with HTML attributes
 * @param {Object} options - Button options
 * @returns {HTMLButtonElement}
 */
function createButton(options) {
  const button = new Button(options);
  return button.render();
}

/**
 * Initialize buttons from data attributes in HTML
 * Usage: <button data-btn-variant="fill" data-btn-size="large">Label</button>
 */
function initButtonsFromDOM() {
  const buttons = document.querySelectorAll('[data-btn-variant]');

  buttons.forEach((btn) => {
    const variant = btn.dataset.btnVariant || 'fill';
    const size = btn.dataset.btnSize || 'large';
    const label = btn.textContent;

    // Get icon if exists
    const iconElement = btn.querySelector('[data-btn-icon]');
    const leadingIcon = iconElement ? iconElement.innerHTML : null;

    // Create new button
    const button = new Button({
      label,
      variant,
      size,
      leadingIcon,
      className: btn.className
    });

    // Replace original element
    const newElement = button.render();
    btn.parentNode.replaceChild(newElement, btn);
  });
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButtonsFromDOM);
  } else {
    initButtonsFromDOM();
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Button, createButton, initButtonsFromDOM };
}
