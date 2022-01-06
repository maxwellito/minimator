import { describe, it, assert, spyOn, resetAllMocks, beforeEach, afterEach, mock } from "../../tests/lib.js";
import { VivusComponent } from "./vivus.cmp.js";
describe('VivusComponent', () => {
    var mockVivus;
    beforeEach(() => {
        mockVivus = spyOn(window, 'Vivus');
    });
    afterEach(() => {
        resetAllMocks();
    });
    it('should load Vivus safely', () => {
        const cmp = new VivusComponent('', () => { });
        const scriptTag = cmp.shadowRoot?.querySelector('script');
        assert(!!scriptTag, true);
        assert(scriptTag.getAttribute('integrity')?.startsWith('sha256'), true);
    });
    it('should destroy Vivus instance on exit', () => {
        const cmp = new VivusComponent('', () => { });
        const mockDestroy = mock();
        cmp.vivus = { destroy: mockDestroy };
        cmp.exit();
        assert(mockDestroy.calls.length, 1);
    });
    it('should call exit callback', () => {
        const exitMock = mock();
        const cmp = new VivusComponent('', exitMock);
        cmp.shadowRoot?.querySelector('button')?.dispatchEvent(new MouseEvent('click'));
        assert(exitMock.calls.length, 1);
    });
});
