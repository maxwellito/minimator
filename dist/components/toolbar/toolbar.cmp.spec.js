import { describe, it, assert, mock } from "../../tests/lib.js";
import { ToolbarComponent } from "./toolbar.cmp.js";
describe('ToolbarComponent', () => {
    it('should link the styling', () => {
        const cmp = new ToolbarComponent(3);
        assert(!!cmp.shadowRoot?.querySelector('link'), true);
    });
    it('should build an unselectable element', () => {
        const tc = new ToolbarComponent(3);
        assert(tc.classList.contains('unselectable'), true);
    });
    it('should call listener after a click on minus', () => {
        const listener = mock();
        const tc = new ToolbarComponent(3);
        tc.on(listener);
        tc.refs.get('minusEvent')?.dispatchEvent(new MouseEvent('click'));
        assert(listener.calls[0][0], 'minus');
    });
    it('should call listener after a click on plus', () => {
        const listener = mock();
        const tc = new ToolbarComponent(3);
        tc.on(listener);
        tc.refs.get('plusEvent')?.dispatchEvent(new MouseEvent('click'));
        assert(listener.calls[0][0], 'plus');
    });
    it('should call listener after a click on grid', () => {
        const listener = mock();
        const tc = new ToolbarComponent(3);
        tc.on(listener);
        tc.refs.get('gridEvent')?.dispatchEvent(new MouseEvent('click'));
        assert(listener.calls[0][0], 'grid');
    });
    it('should call listener after a click on share', () => {
        const listener = mock();
        const tc = new ToolbarComponent(3);
        tc.on(listener);
        tc.refs.get('shareEvent')?.dispatchEvent(new MouseEvent('click'));
        assert(listener.calls[0][0], 'share');
    });
    it('should call listener after a click on download', () => {
        const listener = mock();
        const tc = new ToolbarComponent(3);
        tc.on(listener);
        tc.refs.get('downloadEvent')?.dispatchEvent(new MouseEvent('click'));
        assert(listener.calls[0][0], 'download');
    });
    it('should toggle eraser after clicks on erase', () => {
        const listener = mock();
        const tc = new ToolbarComponent(3);
        tc.on(listener);
        tc.refs.get('toggleEraser')?.dispatchEvent(new MouseEvent('click'));
        assert(listener.calls[0][0], 'eraser');
        assert(listener.calls[0][1], true);
        tc.refs.get('toggleEraser')?.dispatchEvent(new MouseEvent('click'));
        assert(listener.calls[1][0], 'eraser');
        assert(listener.calls[1][1], false);
    });
    it('should set the right thickness', () => {
        const tc = new ToolbarComponent(3);
        const el = tc.refs.get('thickness');
        tc.setThickness(3);
        assert(el?.innerText, '3');
    });
});
