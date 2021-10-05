import { BaseComponent } from './base.cmp.js';

export class PageComponent extends BaseComponent {
  currentTransition = Promise.resolve();
  enter() {
    this.currentTransition = this.currentTransition.then(() => {
      return new Promise((res, rej) => {
        setTimeout(res, 500);
      });
    });
    return this.currentTransition;
  }
  exit(): Promise<void> {
    this.currentTransition = this.currentTransition.then(() => {
      return new Promise((res, rej) => {
        setTimeout(res, 500);
      });
    });
    return this.currentTransition;
  }
}
customElements.define('page-component', PageComponent);
