import { describe, it, assert, mock } from "./tests/lib.js";
import { ToolbarController } from "./toolbarController.js";

describe('ToolbarController', () => {
  it('should build an element with the right class', () => {
    const tc = new ToolbarController();
    assert(tc.el.classList.contains('toolbar'), true);
  });

  it('should build an unselectable element', () => {
    const tc = new ToolbarController();
    assert(tc.el.classList.contains('unselectable'), true);
  });

  it('should call listener after a click on minus', () => {
    const listener: any = mock();
    const tc = new ToolbarController();
    tc.on(listener);
    tc.bits.get('minus')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[0][0], 'minus');
  });

  it('should call listener after a click on plus', () => {
    const listener: any = mock();
    const tc = new ToolbarController();
    tc.on(listener);
    tc.bits.get('plus')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[0][0], 'plus');
  });

  it('should call listener after a click on grid', () => {
    const listener: any = mock();
    const tc = new ToolbarController();
    tc.on(listener);
    tc.bits.get('grid')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[0][0], 'grid');
  });

  it('should call listener after a click on share', () => {
    const listener: any = mock();
    const tc = new ToolbarController();
    tc.on(listener);
    tc.bits.get('share')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[0][0], 'share');
  });

  it('should call listener after a click on download', () => {
    const listener: any = mock();
    const tc = new ToolbarController();
    tc.on(listener);
    tc.bits.get('download')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[0][0], 'download');
  });

  it('should toggle eraser after clicks on erase', () => {
    const listener: any = mock();
    const tc = new ToolbarController();
    tc.on(listener);
    tc.bits.get('eraser')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[0][0], 'eraser');
    assert(listener.calls[0][1], true);
    tc.bits.get('eraser')?.dispatchEvent(new MouseEvent('click'));
    assert(listener.calls[1][0], 'eraser');
    assert(listener.calls[1][1], false);
  });

  it('should set the right thickness', () => {
    const tc = new ToolbarController();
    const el = tc.bits.get('thickness') as HTMLDivElement;
    tc.setThickness(3)
    assert(el?.innerText, '3');
  });
})
