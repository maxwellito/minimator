import { BaseComponent, Component } from '../base.cmp.js';
import '../helper-tooltip/helper-tooltip.cmp.js';
import { icon } from '../../services/feather.icons.js';

const template = `
  <a href="#/home">${icon('home', 'homeLink', 'Return to minimator homesceen')}</a>
  <span class="split"></span>
  ${icon('minus', 'minusEvent', 'Decrease line thickness')}
  <span class="count" data-ref="thickness">3</span>
  ${icon('plus', 'plusEvent', 'Increase line thickness')}
  <span class="split"></span>
  <span data-ref="toggleEraser">
    ${icon('eraser', 'eraserIcon', 'Toggle eraser mode')}
    ${icon('pen', 'penIcon', 'Toggle eraser mode')}
  </span>
  <span class="split"></span>
  ${icon('grid', 'gridEvent', 'Show/hide the canvas grid')}
  <span class="split"></span>
  ${icon('playCircle', 'vivusEvent', 'Play')}
  <span class="split"></span>
  ${icon('share', 'shareEvent', 'Share your actwork')}
  <span class="split"></span>
  ${icon('download', 'downloadEvent', 'Download your artwork')}
  <span class="split"></span>
  ${icon('info', 'toggleInfoTooltip', 'Toggle info')}
  <helper-tooltip-cmp data-ref="infoTooltip"/>
`;

type listener = (type: string, data: any)=>void;

@Component('toolbar-cmp', './src/components/toolbar/toolbar.style.css')
export class ToolbarComponent extends BaseComponent {

  listeners: listener[] = [];
  isEraserOn = false;
  penIcon = SVGElement.prototype;
  eraserIcon = SVGElement.prototype;

  constructor(thickness: number) {
    super(template);

    // Find 'Event' ref elements to dispatch 
    const refKeys = Array.from(this.refs.keys());
    refKeys.forEach(key => {
      if (!key.endsWith('Event')) {
        return;
      }
      const eventName = key.substr(0, key.length - 5)
      this.refs.get(key)?.addEventListener('click', () => {
        this.listeners.forEach(l => l(eventName, null));
      });
    })

    // Set surface mode
    this.penIcon = this.refs.get('penIcon') as SVGElement;
    this.eraserIcon = this.refs.get('eraserIcon') as SVGElement;
    this.penIcon.style.display = 'none';
    this.eraserIcon.style.display = 'inherit';
    this.refs.get('toggleEraser')?.addEventListener('click', this.toggleEraser.bind(this));

    // Listen for click on the tooltip toggler
    this.refs.get('toggleInfoTooltip')?.addEventListener('click', () => {
      this.refs.get('toggleInfoTooltip')?.classList.toggle('enabled');
    });
    this.refs.get('infoTooltip')?.addEventListener('click', () => {
      this.refs.get('toggleInfoTooltip')?.classList.remove('enabled');
    });

    // Block double tap zoom
    this.shadowRoot?.addEventListener('dblclick', e => {
      e.stopPropagation();
      e.preventDefault();
    })

    this.classList.add('unselectable');
    this.setThickness(thickness);
  }

  on(listener: listener) {
    this.listeners.push(listener);
  }

  toggleEraser() {
    this.isEraserOn = !this.isEraserOn;
    this.refs.get('eraser')?.classList.toggle('on');
    this.listeners.forEach(l => l('eraser', this.isEraserOn));
    this.penIcon.style.display = this.isEraserOn ? 'inherit' : 'none';
    this.eraserIcon.style.display = this.isEraserOn ? 'none' : 'inherit';
  }

  setThickness(value: number) {
    const thickness = this.refs.get('thickness') as HTMLSpanElement;
    thickness.innerText = `${value}`;
  }

  destroy() {
    this.listeners = [];
  }
}
