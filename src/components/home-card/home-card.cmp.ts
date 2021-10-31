import { BaseComponent } from '../base.cmp.js';
import { timeago } from '../../services/utils.js';
import { SVG_ICONS } from '../../services/feather.icons.js';
import { StorageIndex } from '../../services/storage/storage.js';
import { store } from '../../store.js';

export class HomeCardComponent extends BaseComponent {
  constructor(data?: StorageIndex) {
    let template: string;
    if (data) {
      template = `
        <div class="img fake-img"></div>
        <div class="label" data-ref="label">${data.title}</div>
        <div class="bottomline">
          <div class="date">${timeago(data.updated_at)}</div>
          <div class="actions">
            <button data-ref="editButton">${SVG_ICONS.edit}</button>
            <button data-ref="deleteButton">${SVG_ICONS.trash}</button>
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

    if (!data) {
      return;
    }

    const editButton = this.refs.get('editButton');
    const deleteButton = this.refs.get('deleteButton');
    const labelText = this.refs.get('label') as HTMLDivElement;

    editButton?.addEventListener('click', (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const newName = prompt(`Rename "${data.title}"`, data.title) || '';
      store.renameItem(data.id, newName);
      labelText.innerText = newName;
    });

    deleteButton?.addEventListener('click', (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      if(confirm(`Are you sure to delete "${data.title}"? There's no going back.`)) {
        store.deleteItem(data.id);
        this.remove();
      }
    });
  }
}
customElements.define('home-card-cmp', HomeCardComponent);
