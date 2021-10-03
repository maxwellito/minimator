import {
  describe,
  it,
  assert,
  afterEach,
  beforeEach,
  mock,
} from '../../tests/lib.js';
import { Shortcut, OPTION_KEYCODE } from './shortcut.js';

describe('Shortcut', () => {
  let addEventListenerBkp: any;
  let aelMock: any;
  let removeEventListenerBkp: any;
  let relMock: any;
  let shrct: Shortcut;
  beforeEach(() => {
    addEventListenerBkp = window.addEventListener;
    aelMock = window.addEventListener = mock();
    removeEventListenerBkp = window.removeEventListener;
    relMock = window.removeEventListener = mock();
    shrct = new Shortcut();
  });
  afterEach(() => {
    window.addEventListener = addEventListenerBkp;
    window.removeEventListener = removeEventListenerBkp;
    shrct.destroy();
  });

  describe('Basics', () => {
    it('should start listening on keyboard events', () => {
      assert(aelMock.calls.length, 2);
      assert(aelMock.calls[0][0], 'keyup');
      assert(aelMock.calls[1][0], 'keydown');
    });

    it('should stop listening on keyboard events after destroy', () => {
      shrct.destroy();
      assert(relMock.calls.length, 2);
      assert(relMock.calls[0][0], 'keyup');
      assert(relMock.calls[1][0], 'keydown');
    });
  });

  describe('Behaviour', () => {
    it('should trigger listeners when a shortcut is pressed', () => {
      let undoCalls = 0;
      shrct.on('undo', () => undoCalls++);
      shrct.onKeyDown({
        keyCode: 90,
        ctrlKey: true,
        preventDefault: () => {},
      } as KeyboardEvent);
      assert(undoCalls, 1);
    });

    it('should detect Mac OS command key instead of CTRL', () => {
      let undoCalls = 0;
      shrct.on('undo', () => undoCalls++);
      shrct.onKeyDown({
        keyCode: OPTION_KEYCODE,
      } as KeyboardEvent);
      shrct.onKeyDown({
        keyCode: 90,
        preventDefault: () => {},
      } as KeyboardEvent);
      assert(undoCalls, 1);
    });

    it('should keep track of the Mac OS command key', () => {
      let undoCalls = 0;
      shrct.on('undo', () => undoCalls++);

      // Command key down
      shrct.onKeyDown({
        keyCode: OPTION_KEYCODE,
      } as KeyboardEvent);
      assert(shrct.isOptionPressed, true);

      // Trigger undo shortcut
      shrct.onKeyDown({
        keyCode: 90,
        preventDefault: () => {},
      } as KeyboardEvent);
      assert(undoCalls, 1);

      // Release command key
      shrct.onKeyUp({
        keyCode: OPTION_KEYCODE,
      } as KeyboardEvent);
      assert(shrct.isOptionPressed, false);

      // Shouldn't trigger undo shortcut
      shrct.onKeyDown({
        keyCode: 90,
        preventDefault: () => {},
      } as KeyboardEvent);
      assert(undoCalls, 1);
    });

    it('should call all listeners of a shortcut when triggered', () => {
      let undoCalls = 0;
      shrct.on('undo', () => undoCalls++);
      shrct.on('undo', () => undoCalls++);
      shrct.onKeyDown({
        keyCode: 90,
        ctrlKey: true,
        preventDefault: () => {},
      } as KeyboardEvent);
      assert(undoCalls, 2);
    });
  });
});
