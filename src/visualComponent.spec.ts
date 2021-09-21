import { describe, it, assert } from './tests/index.js';
import { VisualComponent } from './visualComponent.js';

describe('VisualComponent', () => {
  it('should build a component', () => {
    const cmp = new VisualComponent('<div>Hi.</div>');
    assert(cmp.el.nodeName, 'DIV');
  });

  it('should get all the keys', () => {
    const cmp = new VisualComponent(`
      <div>
        <div data-bit="a"></div>
        <div data-bit="b"></div>
      </div>
    `);
    assert(cmp.bits.get('a')?.nodeName, 'DIV');
    assert(cmp.bits.get('b')?.nodeName, 'DIV');
  })

  it('should throw an error if built with no HTML', () => {
    let catchedError: Error | undefined;
    try {
      new VisualComponent('');
    } catch (e) {
      catchedError = e;
    }
    assert(!!catchedError, true);
    assert(catchedError?.message, 'VisualComponent has been created without HTML');
  });

  it('should throw an error if built with comment', () => {
    let catchedError: Error | undefined;
    try {
      new VisualComponent('<!-- Hello -->');
    } catch (e) {
      catchedError = e;
    }
    assert(!!catchedError, true);
    assert(catchedError?.message, 'VisualComponent has been created without HTML');
  });

  it('should throw an error if built with more than one node', () => {
    let catchedError: Error | undefined;
    try {
      new VisualComponent('<header></header><footer></footer>');
    } catch (e) {
      catchedError = e;
    }
    assert(!!catchedError, true);
    assert(catchedError?.message, 'VisualComponent has been created with more than one node');
  });

  it('should throw an error if built with duplicated key', () => {
    let catchedError: Error | undefined;
    try {
      new VisualComponent(`
        <div>
          <div data-bit="a"></div>
          <div data-bit="a"></div>
        </div>
      `);
    } catch (e) {
      catchedError = e;
    }
    assert(!!catchedError, true);
    assert(catchedError?.message, 'VisualComponent has been created with duplicated key for \'a\'');
  });
})