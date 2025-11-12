var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '../base.cmp.js';
import { PageComponent } from '../page.cmp.js';
import { store } from '../../store.js';
import { downloader } from '../../services/features.js';
const template = `
  <h1>minimator is moving...</h1>
  <p>
    The platform is moving to <a href="https://minimator.maxwellito.com">minimator.maxwellito.com</a>.<br/>
    To ensure a smooth transfer, please export your data.
  </p>
  <ul>
    <li>Export and save your data</li>
    <li>Move to the new <a href="https://minimator.maxwellito.com">domain</a></li>
    <li>Go to the info/about page, then use the upload button</li>
  </ul>
  <p>See you next door</p>
  <button data-ref="exportAction">Download your data</button>
`;
let MigrateComponent = class MigrateComponent extends PageComponent {
    title = 'we\'re moving...';
    constructor() {
        super(template);
        const exportButton = this.refs.get('exportAction');
        const now = new Date();
        const filename = `minimator_export_${now.toISOString().substring(0, 10)}.json`;
        exportButton.addEventListener('click', () => {
            downloader(store.export(), filename);
        });
    }
};
MigrateComponent = __decorate([
    Component('migrate-page', './src/style.css')
], MigrateComponent);
export { MigrateComponent };
