var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '../base.cmp.js';
import { PageComponent } from '../page.cmp.js';
import { icon } from '../../services/feather.icons.js';
let VivusComponent = class VivusComponent extends PageComponent {
    vivus;
    constructor(rawSVG, onExit) {
        const template = `
      ${rawSVG}
      <button class="action-button action-position" data-ref="closeButton">${icon('times')}</button>
      <span>Powered by <a href="https://maxwellito.github.io/vivus/" target="_blank" rel="noopener">vivus</a></span>
    `;
        super(template);
        const script = document.createElement('script');
        script.setAttribute('src', '/assets/vendor/vivus.0.4.6.min.js');
        script.setAttribute('integrity', 'sha256-DSPDv+rS5PAURHc6mTaH9/kBinkq/DA+KRuXganawp4=');
        script.setAttribute('crossorigin', 'anonymous');
        script.onload = () => {
            const svg = this.shadowRoot?.querySelector('svg');
            const content = this.refs.get('content');
            const path = this.refs.get('dots');
            const speed = 200 / parseInt(path.getAttribute('width') || '200', 10);
            svg.insertBefore(content, svg.children[0]);
            this.vivus = new window.Vivus(svg, {
                duration: content.children.length * speed * 20,
                start: 'manual',
                type: 'oneByOne'
            });
            setTimeout(() => {
                this.vivus?.play();
            }, 1000);
        };
        this.shadowRoot?.appendChild(script);
        const closeButton = this.refs.get('closeButton');
        closeButton.addEventListener('click', onExit);
    }
    exit() {
        if (this.vivus) {
            this.vivus.destroy();
        }
        return super.exit();
    }
};
VivusComponent = __decorate([
    Component('vivus-cmp', './src/components/vivus/vivus.style.css')
], VivusComponent);
export { VivusComponent };
