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

@Component('home-page', './src/components/home/home.style.css')
export class HomeComponent extends PageComponent {
  title = 'minimator';
  constructor() {
    super(template);

    const carousel = this.refs.get('carousel') as Element;

    //# Find a nicer way to import this component
    console.log(ThemeSwitchComponent)

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
      card.scrollIntoView({behavior: "smooth"});
    }
  }

  exit() {
    store.onCreate = undefined;
    return super.exit();
  }
}
