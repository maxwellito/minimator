import { icon } from '../../services/feather.icons.js';
import { BaseComponent, Component } from '../base.cmp.js';
import { theme, ThemeMode } from '../../services/theme.js';

@Component('theme-switch-cmp', './src/components/theme-switch/theme-switch.style.css')
export class ThemeSwitchComponent extends BaseComponent {
  htmlDom = document.querySelector('html');
  button: HTMLButtonElement;

  constructor() {

    super(`
      <button data-ref="button" class="action-style">
        <div class="switch">
          ${icon('sun', 'sunIcon', 'Currently on light mode')}
          ${icon('moon', 'moonIcon', 'Currently on dark mode')}
        </div>
      </button>
    `);

    // Listen for click on the switch
    this.button = this.refs.get('button') as HTMLButtonElement;
    this.button.addEventListener('click', this.switchListener.bind(this));

    // Set toggle state
    this.setState();
  }

  setState() {
    if (theme.currentMode === ThemeMode.Dark) {
      this.button.classList.add('on');
    } else {
      this.button.classList.remove('on');
    }
  }

  switchListener (e: Event) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    theme.toggleMode();
    this.setState();
  }
}
