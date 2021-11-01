import { PageComponent } from '../page.cmp.js';

const template = `
  <a class="breadcrumb" href="#/home">☜ homepage</a>
  <h1>What is minimator?</h1>

  <p>Minimator is a minimalist graphical editor.</p>
  <p>All drawings are mades of lines in a grid based canvas. The lines are limited to vertical and horizontal lines, and circle quarter.</p>
  <p>The editor was built with touch tablets in mind, making it a gesture butter. Pro-tip: 2-fingers tap to undo, 3-fingers tap to redo.</p>

  <p>
    If you want to use it offline, simply add the page to your homescreen.
    <ol>
      <li>On iOS: </li>
      <li>on Android: Press the three dots icons in the top right corner, then "Add to Homescreen". (Assuming you're using Google Chrome)</li>
    </ol>
  </p>

  <p>The editor provides tools to save your work and share it easily. Please share your work with the hashtag #minimator.</p>
  <p>All data is stored locally on your device. No tracking. No data collection. No potential leak. There's nothing more GDPR complient than this.</p>
  <p>The source code is open source and available on github.</p>
`;

export class AboutComponent extends PageComponent {
  constructor() {
    super(template, './src/components/about/about.style.css');
  }
}
customElements.define('about-cmp', AboutComponent);
