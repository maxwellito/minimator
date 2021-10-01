import { describe, it, assert, mock } from "../../tests/lib.js";
import { ToolbarComponent } from "./toolbar.cmp.js";

describe('ToolbarComponent', () => {
  it('should link the styling', () => {
    const cmp = new ToolbarComponent();
    assert(!!cmp.shadowRoot?.querySelector('link'), true);
  });

  it('should build an unselectable element', () => {
    const tc = new ToolbarComponent();
    assert(tc.classList.contains('unselectable'), true);
  });

  it('should call listener after a click on minus', () => {
    const listener: any = mock();
    const tc = new ToolbarComponent();
    tc.on(listener);
    tc.subs.get('minus')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[0][0], 'minus');
  });

  it('should call listener after a click on plus', () => {
    const listener: any = mock();
    const tc = new ToolbarComponent();
    tc.on(listener);
    tc.subs.get('plus')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[0][0], 'plus');
  });

  it('should call listener after a click on grid', () => {
    const listener: any = mock();
    const tc = new ToolbarComponent();
    tc.on(listener);
    tc.subs.get('grid')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[0][0], 'grid');
  });

  it('should call listener after a click on share', () => {
    const listener: any = mock();
    const tc = new ToolbarComponent();
    tc.on(listener);
    tc.subs.get('share')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[0][0], 'share');
  });

  it('should call listener after a click on download', () => {
    const listener: any = mock();
    const tc = new ToolbarComponent();
    tc.on(listener);
    tc.subs.get('download')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[0][0], 'download');
  });

  it('should toggle eraser after clicks on erase', () => {
    const listener: any = mock();
    const tc = new ToolbarComponent();
    tc.on(listener);
    tc.subs.get('eraser')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[0][0], 'eraser');
    assert(listener.calls[0][1], true);
    tc.subs.get('eraser')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[1][0], 'eraser');
    assert(listener.calls[1][1], false);
  });

  it('should set the right thickness', () => {
    const tc = new ToolbarComponent();
    const el = tc.subs.get('thickness') as HTMLDivElement;
    tc.setThickness(3)
    assert(el?.innerText, '3');
  });
})
