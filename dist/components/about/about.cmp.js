var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '../base.cmp.js';
import { PageComponent } from '../page.cmp.js';
import { icon } from '../../services/feather.icons.js';
import { store } from '../../store.js';
import { downloader } from '../../services/features.js';
const template = `
  <a class="breadcrumb" href="#/home">☜ homepage</a>
  <h1>What is minimator?</h1>

  <p>Minimator is a minimalist graphical editor.</p>
  <p>All drawings are made of lines in a grid based canvas. The lines are limited to vertical and horizontal lines, and quarter circles.</p>
  <p>The editor was built with touch tablets in mind. Providing undo/redo/zoom/move in a simple gesture. An info tooltip is available in the editor to list the shortcuts available.</p>
  <p>If you want to use it offline, add the page to your homescreen.<br/>On iPad, press the ${icon('share', 'shareEvent', 'Share artwork')} icon in the top right corner then tap on "Add to homescreen".</p>
  <p>The editor provides tools to save your work and share it easily, but also a feature to 'replay' the drawing. Please use the keyword 'minimator' while sharing your work on social media. I'm looking forward to seeing what you will draw.</p>
  <p>All data is stored locally on your device. No tracking and no data collection. There's nothing more GDPR compliant than this.</p>
  <details>
    <summary>Change log</summary>
    <dl>
      <dt>v1.1</dt>
      <dd>Add 'duplicate project' feature</dd>
      <dd>Fix iPhone layout issue</dd>
      <dd>Fix quarter circle precision</dd>
      <dd>Fix navigation rendering glitches</dd>
      <dt>v1.0</dt>
      <dd>Initial release</dd>
    </dl>
  </details>
  <p>The code is open source and available on <a href="https://github.com/maxwellito/minimator/" target="_blank" ref="noopeener">GitHub</a>.</p>
  <p>I hope you will enjoy it as much as I do.</p>
  <p><a href="https://twitter.com/mxwllt" target="_blank" ref="noopeener">@mxwllt</a></p>
  <hr/>
  <p>
    Your data : 
    <button data-ref="exportButton">Download</button>
    <button data-ref="importButton">Upload</button>
    <input
      type="file"
      style="display:none;"
      accept=".json"
      data-ref="fileField"
    />
  </p>
`;
let AboutComponent = class AboutComponent extends PageComponent {
    title = 'About minimator';
    constructor() {
        super(template);
        // Export feature
        const exportButton = this.refs.get('exportButton');
        const now = new Date();
        const filename = `minimator_export_${now.toISOString().substring(0, 10)}.json`;
        exportButton.addEventListener('click', () => {
            downloader(store.export(), filename);
        });
        // Import feature
        const importButton = this.refs.get('importButton');
        const fileField = this.refs.get('fileField');
        importButton.addEventListener('click', () => {
            fileField.click();
        });
        fileField.addEventListener('change', () => {
            const file = fileField.files && fileField.files[0];
            if (!file) {
                return;
            }
            console.log("File selected: ", file);
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target?.result;
                if (typeof content === 'string'
                    && window.confirm('Are you sure? This will override your existing data.')) {
                    store.import(content);
                    window.location.reload();
                }
            };
            reader.onerror = function (e) {
                window.alert('Error reading file:' + e);
            };
            reader.readAsText(file);
        });
    }
};
AboutComponent = __decorate([
    Component('about-page', './src/components/about/about.style.css')
], AboutComponent);
export { AboutComponent };
