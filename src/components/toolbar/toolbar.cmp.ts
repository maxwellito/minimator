import { BaseComponent, Component } from '../base.cmp.js';
import { icon } from '../../services/feather.icons.js';

const template = `
  <a href="#/home">${icon('home', 'homeLink', 'Return to minimator homesceen')}</a>
  <span class="split"></span>
  ${icon('minus', 'minusEvent', 'Decrease line thickness')}
  <span class="count" data-ref="thickness">3</span>
  ${icon('plus', 'plusEvent', 'Increase line thickness')}
  <span class="split"></span>
  ${icon('eraser', 'toggleEraser', 'Toggle eraser mode')}
  <span class="split"></span>
  ${icon('grid', 'gridEvent', 'Show/hide the canvas grid')}
  <span class="split"></span>
  ${icon('playCircle', 'vivusEvent', 'Play')}
  <span class="split"></span>
  ${icon('share', 'shareEvent', 'Share your actwork')}
  <span class="split"></span>
  ${icon('download', 'downloadEvent', 'Download your artwork')}
`;

type listener = (type: string, data: any)=>void;

@Component('toolbar-cmp', './src/components/toolbar/toolbar.style.css')
export class ToolbarComponent extends BaseComponent {

  listeners: listener[] = [];
  isEraserOn = false;

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

    this.refs.get('toggleEraser')?.addEventListener('click', this.toggleEraser.bind(this));
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
  }

  setThickness(value: number) {
    const thickness: any = this.refs.get('thickness');
    thickness.innerText = `${value}`;
  }

  destroy() {
    this.listeners = [];
  }
}
