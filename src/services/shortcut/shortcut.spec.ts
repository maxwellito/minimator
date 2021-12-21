import {
  describe,
  it,
  assert,
  afterEach,
  beforeEach,
  mock,
  Mock,
  spyOn,
  resetAllMocks
} from '../../tests/lib.js';
import { Shortcut } from './shortcut.js';

describe('Shortcut', () => {
  let aelMock: Mock;
  let relMock: Mock;
  let shrct: Shortcut;
  beforeEach(() => {
    aelMock = spyOn(window, 'addEventListener');
    relMock = spyOn(window, 'removeEventListener');
    shrct = new Shortcut();
  });
  
  afterEach(() => {
    resetAllMocks();
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
        key: 'z',
        ctrlKey: true,
        preventDefault: () => {},
      } as KeyboardEvent);
      assert(undoCalls, 1);
    });

    it('should detect Mac OS command key instead of CTRL', () => {
      let undoCalls = 0;
      shrct.on('undo', () => undoCalls++);
      shrct.onKeyDown({
        key: 'Meta',
        metaKey: true
      } as KeyboardEvent);
      shrct.onKeyDown({
        key: 'z',
        metaKey: true,
        preventDefault: () => {},
      } as KeyboardEvent);
      assert(undoCalls, 1);
    });

    it('should keep track of the Mac OS command key', () => {
      let undoCalls = 0;
      shrct.on('undo', () => undoCalls++);

      // Command key down
      shrct.onKeyDown({
        key: 'Meta',
        metaKey: true,
      } as KeyboardEvent);
      assert(shrct.isCtrlMetaOn, true);

      // Trigger undo shortcut
      shrct.onKeyDown({
        key: 'z',
        metaKey: true,
        preventDefault: () => {},
      } as KeyboardEvent);
      assert(undoCalls, 1);

      // Release command key
      shrct.onKeyUp({
        key: 'Meta',
        metaKey: false,
      } as KeyboardEvent);
      assert(shrct.isCtrlMetaOn, false);

      // Shouldn't trigger undo shortcut
      shrct.onKeyDown({
        key: 'z',
        metaKey: false,
        preventDefault: () => {},
      } as KeyboardEvent);
      assert(undoCalls, 1);
    });

    it('should call all listeners of a shortcut when triggered', () => {
      let undoCalls = 0;
      shrct.on('undo', () => undoCalls++);
      shrct.on('undo', () => undoCalls++);
      shrct.onKeyDown({
        key: 'z',
        ctrlKey: true,
        preventDefault: () => {},
      } as KeyboardEvent);
      assert(undoCalls, 2);
    });
  });
});
