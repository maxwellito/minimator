export class BaseComponent extends HTMLElement {

  subs = new Map<string, Element>();

  constructor (html: string = '', cssLink?: string) {
    // Call parent
    super();

    // Create a shadow root
    this.attachShadow({mode: 'open'});

    // Create some CSS to apply to the shadow dom
    if (cssLink) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', cssLink); 
      this.shadowRoot?.append(link);
    }

    // Build the node
    const container = document.createElement('div');
    container.innerHTML = html;
    if (container.children.length === 0) {
      throw new Error('BaseComponent has been created without HTML')
    }

    // Find subs
    const subs = container.querySelectorAll('[data-bit]')
    subs.forEach(bit => {
      const bitName = bit.getAttribute('data-bit');
      if (bitName === null) {
        return;
      }
      if (this.subs.get(bitName)) {
        throw new Error(`BaseComponent has been created with duplicated key for '${bitName}'`)
      }
      this.subs.set(bitName, bit);
    });

    // Append child
    this.append(...container.children);
  }
}
customElements.define('base-component', BaseComponent);
