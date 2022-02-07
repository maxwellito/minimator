/**
 * Decorator for components
 * - Register the element in the custom element registry
 * - Prefetch CSS style for later use
 * @param name Component name for element registry
 * @param cssLink Link to the CSS style sheet
 */
export function Component(name: string, cssLink?: string) { 
  return function (constructor: any) { 
    constructor.prototype.cssLink = cssLink;

    // Register component
    customElements.define(name, constructor);

    // Prefetch Style
    if (cssLink) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'prefetch');
      link.setAttribute('href', cssLink);
      document.head.append(link);
    }
  }
}

/**
 * Root class for components
 */
@Component('base-cmp')
export class BaseComponent extends HTMLElement {
  
  cssLink?: string;
  refs = new Map<string, Element>();

  constructor(html: string = '') {
    // Call parent
    super();

    // Create a shadow root
    this.attachShadow({ mode: 'open' });

    // Create some CSS to apply to the shadow dom
    const {cssLink} = this.constructor.prototype;
    if (cssLink) {
      this.style.visibility = 'hidden';

      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', cssLink);
      link.onload = () => {
        this.style.visibility = 'visible';
      }
      link.onerror = () => {
        throw new Error(`Fail to load stylesheet for ${this.constructor.name}. 
        CSS Link : ${cssLink}`);
      };
      this.shadowRoot?.append(link);
    }

    // Build the node
    const container = document.createElement('div');
    container.innerHTML = html;

    // Find refs
    const refs = container.querySelectorAll('[data-ref]');
    refs.forEach((bit) => {
      const bitName = bit.getAttribute('data-ref');
      if (bitName === null) {
        return;
      }
      if (this.refs.get(bitName)) {
        throw new Error(
          `BaseComponent has been created with duplicated key for '${bitName}'`
        );
      }
      this.refs.set(bitName, bit);
    });

    // Append child
    this.shadowRoot?.append(...container.children);
  }
}