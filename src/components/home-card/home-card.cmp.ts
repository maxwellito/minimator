import { BaseComponent, Component } from '../base.cmp.js';
import { timeago } from '../../services/utils.js';
import { icon } from '../../services/feather.icons.js';
import { StorageIndex } from '../../services/storage/storage.js';
import { store } from '../../store.js';
import { generateBaseSVG } from '../surface/surface.cmp.js';

@Component('home-card-cmp', './src/components/home-card/home-card.style.css')
export class HomeCardComponent extends BaseComponent {
  constructor(data?: StorageIndex) {
    let template: string;
    if (data) {
      template = `
        <div class="img">
          <div class="content" data-ref="imageContainer"></div>
        </div>
        <div class="label title" data-ref="titleLabel">${data.title}</div>
        <div class="bottomline">
          <div class="date">${timeago(data.updated_at)}</div>
          <div class="actions">
            <button data-ref="editButton" alt="Rename artwork">${icon('edit')}</button>
            <button data-ref="deleteButton" alt="Delete artwork">${icon('trash')}</button>
          </div>
        </div>
      `;
    } else {
      template = `
        <div class="icon-xl">+</div>
        <h2 class="label label-xl">Create<br/>a new<br/>canvas</h2>
        <div class="img"></div>
        <div class="label">&nbsp;</div>
        <div class="bottomline">&nbsp;</div>
      `;
    }
    super(template);

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

      const newName = window.prompt(`Rename "${data.title}"`, data.title) || '';
      if (!newName) {
        return;
      } 
      store.renameItem(data.id, newName);
      titleLabel.innerText = newName;
    });

    deleteButton?.addEventListener('click', (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      if(window.confirm(`Are you sure to delete "${data.title}"? There's no going back.`)) {
        store.deleteItem(data.id);
        this.remove();
      }
    });

    const projectData = store.getItem(data.id) || {};
    const surface = new Image(600, 600);
    surface.style.width = '100%';
    surface.style.height = '100%';
    surface.setAttribute('src', `data:image/svg+xml;base64,${btoa(generateBaseSVG(projectData))}`);
    imageContainer.appendChild(surface);
  }
}
