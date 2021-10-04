import { BaseComponent } from '../base.cmp.js';
import { timeago } from '../../services/utils.js';
import { SVG_ICONS } from '../../services/feather.icons.js';

export class HomeCardComponent extends BaseComponent {
  constructor(data?: any) {
    let template: string;
    if (data) {
      template = `
        <div class="img fake-img"></div>
        <div class="label">${data.title}</div>
        <div class="bottomline">
          <div class="date">${timeago(data.updated_at)}</div>
          <div class="actions">
            <button>${SVG_ICONS.edit}</button>
            <button>${SVG_ICONS.trash}</button>
          </div>
        </div>
      `;
    } else {
      template = `
        <div class="img">
          <div class="icon-xl">+</div>
          <h2 class="label label-xl">Create<br/>a new<br/>canvas</h2>
        </div>
        <div class="label">&nbsp;</div>
        <div class="bottomline">&nbsp;</div>
      `;
    }
    super(template, './src/components/home-card/home-card.style.css');
  }
}
customElements.define('home-card-cmp', HomeCardComponent);
