import { Component } from '../base.cmp.js';
import { PageComponent } from '../page.cmp.js';
import { HomeCardComponent } from '../home-card/home-card.cmp.js';
import { store } from '../../store.js';

//# Add a link to the intro page
const template = `
  <a class="about-link title" href="#/about">i</a>
  <h1>minimator.</h1>
  <hr/>
  <div class="home-carousel">
    <div data-ref="carousel" class="home-carousel-wrap"></div>
  </div>
`;

@Component('home-page', './src/components/home/home.style.css')
export class HomeComponent extends PageComponent {
  constructor() {
    super(template);

    //# Clean dat dirty thing
    document.title = `minimator`;

    const createCard = new HomeCardComponent();
    this.refs.get('carousel')?.append(createCard);
    createCard.onclick = () => (location.hash = '#/create');

    store.loadIndexes().forEach((d) => {
      const card = new HomeCardComponent(d);
      this.refs.get('carousel')?.append(card);
      card.onclick = () => (location.hash = `#/project/${d.id}`);
    });
  }
}
