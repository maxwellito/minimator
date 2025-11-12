var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '../base.cmp.js';
import { PageComponent } from '../page.cmp.js';
import { HomeCardComponent } from '../home-card/home-card.cmp.js';
import { ThemeSwitchComponent } from '../theme-switch/theme-switch.cmp.js';
import { store } from '../../store.js';
const template = `
  <div class="top">
    <div class="header">
      <h1>minimator.</h1>
      <hr/>
    </div>
    <div class="actions">
      <theme-switch-cmp></theme-switch-cmp>
      <a class="action-button title" href="#/about">i</a>
    </div>
  </div>
  <div class="home-carousel">
    <div data-ref="carousel" class="home-carousel-wrap"></div>
  </div>
`;
let HomeComponent = class HomeComponent extends PageComponent {
    title = 'minimator';
    constructor() {
        super(template);
        const carousel = this.refs.get('carousel');
        //# Find a nicer way to import this component
        console.log(ThemeSwitchComponent);
        const createCard = new HomeCardComponent();
        carousel.append(createCard);
        createCard.onclick = () => (location.hash = '#/create');
        store.loadIndexes().forEach((d) => {
            const card = new HomeCardComponent(d);
            carousel.appendChild(card);
            card.onclick = () => (location.hash = `#/project/${d.id}`);
        });
        store.onCreate = (newItem) => {
            const card = new HomeCardComponent(newItem);
            carousel.insertBefore(card, carousel.children[1]);
            card.onclick = () => (location.hash = `#/project/${newItem.id}`);
            setTimeout(() => card.scrollIntoView({
                behavior: "smooth",
            }), 120);
        };
    }
    exit() {
        store.onCreate = undefined;
        return super.exit();
    }
};
HomeComponent = __decorate([
    Component('home-page', './src/components/home/home.style.css')
], HomeComponent);
export { HomeComponent };
