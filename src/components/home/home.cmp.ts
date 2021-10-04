import { BaseComponent } from '../base.cmp.js';
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
    title: 'calipso',
    created_at: Date.now() - 2 * 24 * 60 * 60000,
    updated_at: Date.now() - 1 * 24 * 60 * 60000,
    img: '...',
  },
  {
    title: 'UI Boxes',
    created_at: Date.now() - 2 * 24 * 60 * 60000,
    updated_at: Date.now() - 0.5 * 24 * 60 * 60000,
    img: '...',
  },
  {
    title: 'Klingon',
    created_at: Date.now() - 2 * 24 * 60 * 60000,
    updated_at: Date.now() - 0.25 * 24 * 60 * 60000,
    img: '...',
  },
  {
    title: 'Didot',
    created_at: Date.now() - 2 * 24 * 60 * 60000,
    updated_at: Date.now() - 1 * 24 * 60 * 60000,
    img: '...',
  },
  {
    title: 'Laventura',
    created_at: Date.now() - 2 * 24 * 60 * 60000,
    updated_at: Date.now() - 0.5 * 24 * 60 * 60000,
    img: '...',
  },
  {
    title: 'Roma',
    created_at: Date.now() - 2 * 24 * 60 * 60000,
    updated_at: Date.now() - 0.25 * 24 * 60 * 60000,
    img: '...',
  },
];

export class HomeComponent extends BaseComponent {
  constructor() {
    super(template, './src/components/home/home.style.css');
    this.refs.get('carousel')?.append(new HomeCardComponent());
    mockData.forEach((d) => {
      this.refs.get('carousel')?.append(new HomeCardComponent(d));
    });
  }
}
customElements.define('home-cmp', HomeComponent);
