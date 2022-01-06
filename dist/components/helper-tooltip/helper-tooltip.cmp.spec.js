import { describe, it, assert } from "../../tests/lib.js";
import { HelperTooltipComponent } from "./helper-tooltip.cmp.js";
describe('HelperTooltipComponent', () => {
    it('should have some content', () => {
        const cmp = new HelperTooltipComponent();
        assert(cmp.shadowRoot?.querySelectorAll('span.line').length, 2);
    });
});
