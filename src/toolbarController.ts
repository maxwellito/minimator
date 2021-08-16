import { VisualComponent } from './visualComponent.js';

const template = `
  <div class="toolbar">
    <button data-bit="minus">-</button>
    <span data-bit="thickness">3</span>
    <button data-bit="plus">+</button>
    <span>|</span>
    <button data-bit="grid">G</button>
    <span>|</span>
    <button data-bit="share">S</button>
    <span>|</span>
    <button data-bit="download">D</button>
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




}