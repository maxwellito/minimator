import { BaseComponent, Component } from '../base.cmp.js';
import { SVG_ICONS } from '../../services/feather.icons.js';

const template = `
  ${SVG_ICONS.minus}
  <span class="count" data-ref="thickness">3</span>
  ${SVG_ICONS.plus}
  <span class="split"></span>
  ${SVG_ICONS.eraser}
  <span class="split"></span>
  ${SVG_ICONS.grid}
  <span class="split"></span>
  ${SVG_ICONS.playButton}
  <span class="split"></span>
  ${SVG_ICONS.share}
  <span class="split"></span>
  ${SVG_ICONS.download}
`;

type listener = (type: string, data: any)=>void;

@Component('toolbar-cmp', './src/components/toolbar/toolbar.style.css')
export class ToolbarComponent extends BaseComponent {

  listeners: listener[] = [];
  isEraserOn = false;

  constructor() {
    super(template);
    this.classList.add('unselectable');
    this.refs.get('minus')?.addEventListener('click', this.minus.bind(this));
    this.refs.get('plus')?.addEventListener('click', this.plus.bind(this));
    this.refs.get('grid')?.addEventListener('click', this.grid.bind(this));
    this.refs.get('playButton')?.addEventListener('click', this.vivus.bind(this));
    this.refs.get('share')?.addEventListener('click', this.share.bind(this));
    this.refs.get('download')?.addEventListener('click', this.download.bind(this));
    this.refs.get('eraser')?.addEventListener('click', this.toggleEraser.bind(this));
  }

  on(listener: listener) {
    this.listeners.push(listener);
  }

  //# Clean these dirty methods
  minus() {
    this.listeners.forEach(l => l('minus', null));
  }
  plus() {
    this.listeners.forEach(l => l('plus', null));
  }
  grid() {
    this.listeners.forEach(l => l('grid', null));
  }
  vivus() {
    this.listeners.forEach(l => l('vivus', null));
  }
  share() {
    this.listeners.forEach(l => l('share', null));
  }
  download() {
    this.listeners.forEach(l => l('download', null));
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
}
