import { PageComponent } from '../page.cmp.js';
import { HomeCardComponent } from '../home-card/home-card.cmp.js';

const template = `
  <h1>minimator.</h1>
  <hr/>
  <div class="home-carousel">
    <div data-ref="carousel" class="home-carousel-wrap"></div>
  </div>
`;

const mockData = [
  {
    id: 0,
    title: 'calipso',
    created_at: Date.now() - 2 * 24 * 60 * 60000,
    updated_at: Date.now() - 1 * 24 * 60 * 60000,
    img: '...',
  },
  {
    id: 1,
    title: 'UI Boxes',
    created_at: Date.now() - 2 * 24 * 60 * 60000,
    updated_at: Date.now() - 0.5 * 24 * 60 * 60000,
    img: '...',
  },
  {
    id: 3,
    title: 'Klingon',
    created_at: Date.now() - 2 * 24 * 60 * 60000,
    updated_at: Date.now() - 0.25 * 24 * 60 * 60000,
    img: '...',
  },
  {
    id: 6,
    title: 'Didot',
    created_at: Date.now() - 2 * 24 * 60 * 60000,
    updated_at: Date.now() - 1 * 24 * 60 * 60000,
    img: '...',
  },
  {
    id: 8,
    title: 'Laventura',
    created_at: Date.now() - 2 * 24 * 60 * 60000,
    updated_at: Date.now() - 0.5 * 24 * 60 * 60000,
    img: '...',
  },
  {
    id: 9,
    title: 'Roma',
    created_at: Date.now() - 2 * 24 * 60 * 60000,
    updated_at: Date.now() - 0.25 * 24 * 60 * 60000,
    img: '...',
  },
];

export class HomeComponent extends PageComponent {
  constructor() {
    super(template, './src/components/home/home.style.css');

    const createCard = new HomeCardComponent();
    this.refs.get('carousel')?.append(createCard);
    createCard.onclick = () => (location.hash = '#create');

    mockData.forEach((d) => {
      const card = new HomeCardComponent(d);
      this.refs.get('carousel')?.append(card);
      card.onclick = () => (location.hash = `#project/${d.id}`);
    });
  }
}
customElements.define('home-cmp', HomeComponent);
