var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '../base.cmp.js';
import { PageComponent } from '../page.cmp.js';
import { icon } from '../../services/feather.icons.js';
const template = `
  <a class="breadcrumb" href="#/home">☜ homepage</a>
  <h1>What is minimator?</h1>

  <p>Minimator is a minimalist graphical editor.</p>
  <p>All drawings are made of lines in a grid based canvas. The lines are limited to vertical and horizontal lines, and quarter circles.</p>
  <p>The editor was built with touch tablets in mind. Providing undo/redo/zoom/move in a simple gesture. An info tooltip is available in the editor to list the shortcuts available.</p>
  <p>If you want to use it offline, add the page to your homescreen.<br/>On iPad, press the ${icon('share', 'shareEvent', 'Share artwork')} icon in the top right corner then tap on "Add to homescreen".</p>
  <p>The editor provides tools to save your work and share it easily, but also a feature to 'replay' the drawing. Please use the keyword 'minimator' while sharing your work on social media. I'm looking forward to seeing what you will draw.</p>
  <p>All data is stored locally on your device. No tracking and no data collection. There's nothing more GDPR compliant than this.</p>
  <p>The code is open source and available on <a href="https://github.com/maxwellito/minimator/" target="_blank" ref="noopeener">GitHub</a>.</p>
  <p>I hope you will enjoy it as much as I do.</p>
  <p><a href="https://twitter.com/mxwllt" target="_blank" ref="noopeener">@mxwllt</a></p>
`;
let AboutComponent = class AboutComponent extends PageComponent {
    title = 'About minimator';
    constructor() {
        super(template);
    }
};
AboutComponent = __decorate([
    Component('about-page', './src/components/about/about.style.css')
], AboutComponent);
export { AboutComponent };
