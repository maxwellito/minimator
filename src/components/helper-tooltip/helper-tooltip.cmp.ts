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

@Component('helper-tooltip-cmp', './src/components/helper-tooltip/helper-tooltip.style.css')
export class HelperTooltipComponent extends BaseComponent {

  constructor() {
    super(template);
  }
}
