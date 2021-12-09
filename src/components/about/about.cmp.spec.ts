import { describe, it, assert } from "../../tests/lib.js";

import { AboutComponent } from "./about.cmp.js";

describe('AboutComponent', () => {
  
  it('should build and display stuff', () => {
    const cmp = new AboutComponent();
    const title = cmp.shadowRoot?.querySelector('h1');
    assert(!!title, true);
    assert(title?.innerText, 'What is minimator?');
  });

  it('should have a link back to the homescreen', () => {
    const cmp = new AboutComponent();
    const anchor = cmp.shadowRoot?.querySelector('a');
    assert(!!anchor, true);
    assert(anchor?.getAttribute('href'), '#/home');
  });
});