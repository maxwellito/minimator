var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { icon } from '../../services/feather.icons.js';
import { BaseComponent, Component } from '../base.cmp.js';
import { theme, ThemeMode } from '../../services/theme.js';
let ThemeSwitchComponent = class ThemeSwitchComponent extends BaseComponent {
    htmlDom = document.querySelector('html');
    button;
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
        this.button = this.refs.get('button');
        this.button.addEventListener('click', this.switchListener.bind(this));
        // Set toggle state
        this.setState();
    }
    setState() {
        if (theme.currentMode === ThemeMode.Dark) {
            this.button.classList.add('on');
        }
        else {
            this.button.classList.remove('on');
        }
    }
    switchListener(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        theme.toggleMode();
        this.setState();
    }
};
ThemeSwitchComponent = __decorate([
    Component('theme-switch-cmp', './src/components/theme-switch/theme-switch.style.css')
], ThemeSwitchComponent);
export { ThemeSwitchComponent };
