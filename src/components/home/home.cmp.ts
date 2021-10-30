import { PageComponent } from '../page.cmp.js';
import { HomeCardComponent } from '../home-card/home-card.cmp.js';
import { store } from '../../store.js';

const template = `
  <h1>minimator.</h1>
  <hr/>
  <div class="home-carousel">
    <div data-ref="carousel" class="home-carousel-wrap"></div>
  </div>
`;

export class HomeComponent extends PageComponent {
  constructor() {
    super(template, './src/components/home/home.style.css');

    const createCard = new HomeCardComponent();
    this.refs.get('carousel')?.append(createCard);
    createCard.onclick = () => (location.hash = '#/create');

    store.loadIndexes().forEach((d) => {
      const card = new HomeCardComponent(d);
      this.refs.get('carousel')?.append(card);
      card.onclick = () => (location.hash = `#/project/${d.id}`);
    });
  }

  exit(): Promise<void> {
    return new Promise((res) => {
      const listener = () => {
        res();
        this.removeEventListener('animationend', listener);
      };
      this.addEventListener('animationend', listener);
      this.classList.add('exit');
    });
  }
}
customElements.define('home-cmp', HomeComponent);
