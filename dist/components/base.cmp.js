var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Decorator for components
 * - Register the element in the custom element registry
 * - Prefetch CSS style for later use
 * @param name Component name for element registry
 * @param cssLink Link to the CSS style sheet
 */
export function Component(name, cssLink) {
    return function (constructor) {
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
    };
}
/**
 * Root class for components
 */
let BaseComponent = class BaseComponent extends HTMLElement {
    cssLink;
    refs = new Map();
    constructor(html = '') {
        // Call parent
        super();
        // Create a shadow root
        this.attachShadow({ mode: 'open' });
        // Create some CSS to apply to the shadow dom
        const { cssLink } = this.constructor.prototype;
        if (cssLink) {
            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', cssLink);
            link.onload = () => {
                this.style.visibility = 'visible';
            };
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
                throw new Error(`BaseComponent has been created with duplicated key for '${bitName}'`);
            }
            this.refs.set(bitName, bit);
        });
        // Append child
        this.shadowRoot?.append(...container.children);
        this.style.visibility = 'hidden';
        ;
    }
};
BaseComponent = __decorate([
    Component('base-cmp')
], BaseComponent);
export { BaseComponent };
