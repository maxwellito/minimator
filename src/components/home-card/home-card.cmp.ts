import { BaseComponent } from '../base.cmp.js';
import { timeago } from '../../services/utils.js';
import { SVG_ICONS } from '../../services/feather.icons.js';
import { StorageIndex } from '../../services/storage/storage.js';
import { store } from '../../store.js';
import { SurfaceComponent } from '../surface/surface.cmp.js';

export class HomeCardComponent extends BaseComponent {
  constructor(data?: StorageIndex) {
    let template: string;
    if (data) {
      template = `
        <div class="img" data-ref="imageContainer"></div>
        <div class="label" data-ref="titleLabel">${data.title}</div>
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
    const titleLabel = this.refs.get('titleLabel') as HTMLDivElement;
    const imageContainer = this.refs.get('imageContainer') as HTMLDivElement;

    editButton?.addEventListener('click', (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const newName = prompt(`Rename "${data.title}"`, data.title) || '';
      store.renameItem(data.id, newName);
      titleLabel.innerText = newName;
    });

    deleteButton?.addEventListener('click', (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      if(confirm(`Are you sure to delete "${data.title}"? There's no going back.`)) {
        store.deleteItem(data.id);
        this.remove();
      }
    });

    const content = store.getItem(data.id) || '{}';
    const contentData = JSON.parse(content);
    const surface = new SurfaceComponent(
      contentData.width, 
      contentData.height, 
      contentData.content
    );
    surface.setDefaultViewBox();
    imageContainer.appendChild(surface)
  }
}
customElements.define('home-card-cmp', HomeCardComponent);
