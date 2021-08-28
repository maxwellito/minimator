import { VisualComponent } from './visualComponent.js';
import { SVG_ICONS } from './toolbarController.icons.js';

const template = `
  <div class="toolbar unselectable">
    ${SVG_ICONS.minus}
    <span class="count" data-bit="thickness">3</span>
    ${SVG_ICONS.plus}
    <span class="split"></span>
    ${SVG_ICONS.eraser}
    <span class="split"></span>
    ${SVG_ICONS.grid}
    <span class="split"></span>
    ${SVG_ICONS.share}
    <span class="split"></span>
    ${SVG_ICONS.download}
  <div>
`;

type listener = (type: string, data: any)=>void;

export class ToolbarController extends VisualComponent {

  listeners: listener[] = [];

  constructor() {
    super(template);
    this.bits.get('minus')?.addEventListener('click', this.minus.bind(this));
    this.bits.get('plus')?.addEventListener('click', this.plus.bind(this));
    this.bits.get('grid')?.addEventListener('click', this.grid.bind(this));
    this.bits.get('share')?.addEventListener('click', this.share.bind(this));
    this.bits.get('download')?.addEventListener('click', this.download.bind(this));
  }

  on(listener: listener) {
    this.listeners.push(listener);
  }

  minus() {
    this.listeners.forEach(l => l('minus', null));
  }
  plus() {
    this.listeners.forEach(l => l('plus', null));
  }
  grid() {
    this.listeners.forEach(l => l('grid', null));
  }
  share() {
    this.listeners.forEach(l => l('share', null));
  }
  download() {
    this.listeners.forEach(l => l('download', null));
  }

  setThickness(value: number) {
    const thickness: any = this.bits.get('thickness');
    thickness.innerText = `${value}`;
  }
}

