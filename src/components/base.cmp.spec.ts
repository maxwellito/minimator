import { describe, it, assert } from '../tests/lib.js';
import { BaseComponent } from './base.cmp.js';

describe('BaseComponent', () => {
  it('should build a component', () => {
    const cmp = new BaseComponent('<div>Hi.</div>');
    assert(cmp.shadowRoot?.textContent, 'Hi.');
  });

  it('should get all the keys', () => {
    const cmp = new BaseComponent(`
      <div>
        <div data-ref="a"></div>
        <div data-ref="b"></div>
      </div>
    `);
    assert(cmp.refs.get('a')?.nodeName, 'DIV');
    assert(cmp.refs.get('b')?.nodeName, 'DIV');
  });

  it('should not throw an error if built with no HTML', () => {
    let catchedError: any;
    try {
      new BaseComponent('');
    } catch (e) {
      catchedError = e;
    }
    assert(!!catchedError, false);
  });

  it('should not throw an error if built with comment', () => {
    let catchedError: any;
    try {
      new BaseComponent('<!-- Hello -->');
    } catch (e) {
      catchedError = e;
    }
    assert(!!catchedError, false);
  });

  it('should be able to build a component with more than one node', () => {
    const cmp = new BaseComponent('<header></header><footer></footer>');
    assert(cmp.shadowRoot?.children.length, 2);
  });

  it('should throw an error if built with duplicated key', () => {
    let catchedError: any;
    try {
      new BaseComponent(`
        <div>
          <div data-ref="a"></div>
          <div data-ref="a"></div>
        </div>
      `);
    } catch (e) {
      catchedError = e;
    }
    assert(!!catchedError, true);
    assert(
      catchedError?.message,
      "BaseComponent has been created with duplicated key for 'a'"
    );
  });

  it('should link a CSS file when provided', () => {
    const cmp = new BaseComponent('<header></header>', './src/style.css');
    assert(!cmp.querySelector('link'), true);
  });
});
