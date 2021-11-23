import { Component } from '../base.cmp.js';
import { PageComponent } from '../page.cmp.js';
import { icon } from '../../services/feather.icons.js';

@Component('vivus-cmp', './src/components/vivus/vivus.style.css')
export class VivusComponent extends PageComponent {

  vivus: Vivus | undefined;

  constructor(rawSVG: string, onExit: () => void) {
    const template = `
      ${rawSVG}
      <button class="action-button action-position" data-ref="closeButton">${icon('times')}</button>
      <p>Powered by <a href="https://maxwellito.github.io/vivus/" target="_blank" rel="noopener">vivus</a></p>
    `;

    super(template);

    const script = document.createElement('script');
    script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/vivus@0.4.6/dist/vivus.min.js');
    script.setAttribute('integrity', 'sha256-DSPDv+rS5PAURHc6mTaH9/kBinkq/DA+KRuXganawp4=');
    script.setAttribute('crossorigin', 'anonymous');
    script.onload = () => {
      const svg = this.shadowRoot?.querySelector('svg') as SVGElement;
      const content = this.refs.get('content') as SVGGElement;
      const path = this.refs.get('dots') as SVGPathElement;
      const speed = 200 / parseInt(path.getAttribute('width') || '200', 10);

      svg.insertBefore(content, svg.children[0]);
      this.vivus = new (window as any).Vivus(svg, {
        duration: content.children.length * speed * 20,
        start: 'manual',
        type: 'oneByOne'
      });
      setTimeout(() => {
        this.vivus?.play()
      }, 1000);
    }
    this.shadowRoot?.appendChild(script);

    const closeButton = this.refs.get('closeButton') as HTMLButtonElement;
    closeButton.addEventListener('click', onExit);
  }

  exit() {
    if (this.vivus) {
      this.vivus.destroy();
    }
    return super.exit();
  }
}
