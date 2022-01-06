import { BaseComponent } from './base.cmp.js';
export class PageComponent extends BaseComponent {
    title = 'minimator';
    currentTransition = Promise.resolve();
    enter() {
        this.currentTransition = this.currentTransition.then(() => {
            return new Promise((res, rej) => {
                setTimeout(res, 500);
            });
        });
        return this.currentTransition;
    }
    exit() {
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
customElements.define('page-component', PageComponent);
