var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseComponent, Component } from '../base.cmp.js';
import { timeago } from '../../services/utils.js';
import { icon } from '../../services/feather.icons.js';
import { store } from '../../store.js';
import { SurfaceComponent } from '../surface/surface.cmp.js';
let HomeCardComponent = class HomeCardComponent extends BaseComponent {
    constructor(data) {
        let template;
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
        }
        else {
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
        const titleLabel = this.refs.get('titleLabel');
        const imageContainer = this.refs.get('imageContainer');
        editButton?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const newName = window.prompt(`Rename "${data.title}"`, data.title) || '';
            if (!newName) {
                return;
            }
            store.renameItem(data.id, newName);
            titleLabel.innerText = newName;
        });
        deleteButton?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm(`Are you sure to delete "${data.title}"? There's no going back.`)) {
                store.deleteItem(data.id);
                this.remove();
            }
        });
        const projectData = store.getItem(data.id) || {};
        const surface = new SurfaceComponent(projectData);
        surface.setDefaultViewBox();
        imageContainer.appendChild(surface);
    }
};
HomeCardComponent = __decorate([
    Component('home-card-cmp', './src/components/home-card/home-card.style.css')
], HomeCardComponent);
export { HomeCardComponent };
