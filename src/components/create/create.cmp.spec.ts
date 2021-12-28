import { describe, it, assert, spyOn, resetAllMocks, beforeEach, afterEach, Mock } from "../../tests/lib.js";

import { store } from '../../store.js';
import { CreateComponent } from "./create.cmp.js";

describe('CreateComponent', () => {

  let currentLocation: string;
  let mockCreateItem: Mock;

  beforeEach(() => {
    currentLocation = window.location.hash;
    mockCreateItem = spyOn(store, 'createItem', {id: 7});
  });
  afterEach(() => {
    if (window.location.hash !== currentLocation) {
      window.location.hash = currentLocation;
    }
    resetAllMocks();
  });

  it('should has a link back to the homepage', () => {
    const cmp = new CreateComponent();
    assert(!!cmp.shadowRoot?.querySelector('a[href="#/home"]'), true);
  });

  it('should create a canvas with form data', () => {
    const cmp = new CreateComponent();
    const form = cmp.refs.get('form') as HTMLFormElement;
    const inputWidth = cmp.refs.get('inputWidth') as HTMLInputElement;
    const inputHeight = cmp.refs.get('inputHeight') as HTMLInputElement;
    const inputName = cmp.refs.get('inputName') as HTMLInputElement;

    inputWidth.value = '20';
    inputHeight.value = '40';
    inputName.value = 'Hello';
    form.dispatchEvent(new (window as any).SubmitEvent('submit'));

    const createCall = mockCreateItem.calls[0];
    assert(!!createCall, true);
    assert(createCall[0], 'Hello');
    assert(createCall[1].width, 20);
    assert(createCall[1].height, 40);
    assert(createCall[1].thickness, 3);
    assert(createCall[1].content, '');

    assert(window.location.hash, `#/project/7`);
  });
});
