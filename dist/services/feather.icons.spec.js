import { describe, it, assert } from '../tests/lib.js';
import { icon } from './feather.icons.js';
describe('FeatherIcons', () => {
    it('should return a valid SVG', () => {
        const petriDish = document.createElement('div');
        petriDish.innerHTML = icon('home');
        assert(petriDish.children[0].tagName, 'svg');
    });
    it('should not have a data-ref attribute when not requested', () => {
        const petriDish = document.createElement('div');
        petriDish.innerHTML = icon('home');
        assert(!!petriDish.querySelector('svg[data-ref]'), false);
    });
    it('should set the requested ref', () => {
        const petriDish = document.createElement('div');
        petriDish.innerHTML = icon('home', 'home-icon');
        assert(!!petriDish.querySelector('svg[data-ref="home-icon"]'), true);
    });
    it('should set description helpers when requested', () => {
        const petriDish = document.createElement('div');
        petriDish.innerHTML = icon('home', 'home-icon', 'Back to homescreen');
        const svgTag = petriDish.querySelector('svg');
        const titleTag = petriDish.querySelector('svg > title');
        assert(!!svgTag, true);
        assert(svgTag?.getAttribute('alt'), 'Back to homescreen');
        assert(!!titleTag, true);
        assert(titleTag?.innerHTML, 'Back to homescreen');
    });
});
