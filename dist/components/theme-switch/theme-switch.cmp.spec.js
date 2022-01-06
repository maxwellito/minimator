import { describe, it, assert, beforeEach, afterEach, spyOn, resetAllMocks } from "../../tests/lib.js";
import { theme, ThemeMode } from '../../services/theme.js';
import { ThemeSwitchComponent } from "./theme-switch.cmp.js";
describe('ThemeSwitchComponent', () => {
    var initialTheme;
    var mockToggleMode;
    beforeEach(() => {
        initialTheme = theme.currentMode;
        mockToggleMode = spyOn(theme, 'toggleMode');
    });
    afterEach(() => {
        theme.currentMode = initialTheme;
        resetAllMocks();
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
        assert(mockToggleMode.calls.length, 1);
    });
});
