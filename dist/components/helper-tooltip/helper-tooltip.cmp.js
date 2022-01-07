var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseComponent, Component } from '../base.cmp.js';
const template = `
  <h1>information</h1>
  <span class="line">Tablet/Phone</span>
  <ul>
    <li>
      <span>Undo: </span>
      <span>2 fingers tap</span>
    </li>
    <li>
      <span>Redo: </span>
      <span>3 fingers tap</span>
    </li>
    <li>
      <span>Move/Scale: </span>
      <span>2 fingers drag/pinch</span>
    </li>
  </ul>

  <span class="line">Desktop</span>
  <ul>
    <li>
      <span>Undo: </span>
      <span class="key">CTRL/CMD</span>
      <span> + </span>
      <span class="key">Z</span>
    </li>
    <li>
      <span>Redo: </span>
      <span class="key">CTRL/CMD</span>
      <span> + </span>
      <span class="key">Y</span>
    </li>
    <li>
      <span>Zoom in/out: </span>
      <span class="key">CTRL/CMD</span>
      <span> + </span>
      <span class="key">-</span>
      <span>/</span>
      <span class="key">+</span>
    </li>
  </ul>
`;
let HelperTooltipComponent = class HelperTooltipComponent extends BaseComponent {
    constructor() {
        super(template);
    }
};
HelperTooltipComponent = __decorate([
    Component('helper-tooltip-cmp', './src/components/helper-tooltip/helper-tooltip.style.css')
], HelperTooltipComponent);
export { HelperTooltipComponent };
