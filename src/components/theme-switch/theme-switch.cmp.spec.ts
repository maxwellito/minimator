import { describe, it, assert, mock, beforeEach, afterEach } from "../../tests/lib.js";
import { theme, ThemeMode } from '../../services/theme.js';
import { ThemeSwitchComponent } from "./theme-switch.cmp.js";

describe('ThemeSwitchComponent', () => {

  var initialTheme: string;
  var originalToggleMode: () => void;

  beforeEach(() => {
    initialTheme = theme.currentMode;
    originalToggleMode = theme.toggleMode;
    theme.toggleMode = mock();
  });
  afterEach(() => {
    theme.currentMode = initialTheme;
    theme.toggleMode = originalToggleMode;
  });

  it('should set the right style for dark mode', () => {
    theme.currentMode = ThemeMode.Dark;
    const cmp = new ThemeSwitchComponent();
    assert(cmp.button.classList.contains('on'), true);
  });

  it('should set the right style for light mode', () => {
    theme.currentMode = ThemeMode.Light;
    const cmp = new ThemeSwitchComponent();
    assert(cmp.button.classList.contains('on'), false);
  });

  it('should toggle on click', () => {
    theme.currentMode = ThemeMode.Light;
    const cmp = new ThemeSwitchComponent();
    theme.currentMode = ThemeMode.Dark;
    cmp.button.dispatchEvent(new MouseEvent('click'));
    assert(cmp.button.classList.contains('on'), true);
    assert((theme.toggleMode as any).calls.length, 1);
  });
});