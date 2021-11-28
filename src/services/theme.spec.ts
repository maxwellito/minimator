import { afterEach, beforeEach, describe, spyOn, Mock, resetAllMocks, it, assert } from '../tests/lib.js';
import { store } from '../store.js'; 
import { theme, ThemeMode } from './theme.js';

describe('timeago', () => {
  var getKeyMock: Mock;
  var setKeyMock: Mock;
  var setPropertyMock: Mock;

  beforeEach(() => {
    getKeyMock = spyOn(store, 'getKey');
    setKeyMock = spyOn(store, 'setKey');
    setPropertyMock = spyOn(document.body.style, 'setProperty');
  });
  afterEach(() => {
    resetAllMocks();
  });

  it('should default to light mode', () => {
    getKeyMock.andReturn(null);
    theme.initialisation();
    assert(theme.currentMode, ThemeMode.Light);
  });

  it('should set the state at initialisation', () => {
    getKeyMock.andReturn(ThemeMode.Dark);
    theme.initialisation();
    assert(setKeyMock.calls.length, 1);
    assert(setKeyMock.calls[0][0], 'theme');
    assert(setKeyMock.calls[0][1], ThemeMode.Dark);
    assert(setPropertyMock.calls[0][0], '--is-dark-mode');
    assert(setPropertyMock.calls[0][1], ThemeMode.Dark);
  });

  it('should read initial state from the store', () => {
    getKeyMock.andReturn(ThemeMode.Dark);
    theme.initialisation();
    assert(theme.currentMode, ThemeMode.Dark);
  });

  it('should toggle the current state', () => {
    getKeyMock.andReturn(ThemeMode.Dark);
    theme.initialisation();
    theme.toggleMode();
    assert(theme.currentMode, ThemeMode.Light);
  });

  it('should save state after toggle', () => {
    getKeyMock.andReturn(ThemeMode.Dark);
    theme.initialisation();
    theme.toggleMode();

    const lastSetKeyCall = setKeyMock.calls.pop() as [string, string];
    assert(lastSetKeyCall[0], 'theme');
    assert(lastSetKeyCall[1], ThemeMode.Light);

    const lastSetPropertyCall = setPropertyMock.calls.pop() as [string, string];
    assert(lastSetPropertyCall[0], '--is-dark-mode');
    assert(lastSetPropertyCall[1], ThemeMode.Light);
  });
});