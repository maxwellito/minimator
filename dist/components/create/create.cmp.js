var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '../base.cmp.js';
import { PageComponent } from '../page.cmp.js';
import { store } from '../../store.js';
import { icon } from '../../services/feather.icons.js';
import { TouchController, GESTURE, STATE, } from '../../services/touchController/touchController.js';
const template = `
  <a class="breadcrumb" href="#/home">☜ homepage</a>
  <h1>Create a new canvas</h1>
  <form class="create-container" data-ref="form">
    <div class="create-column">
      <label>Dimensions</label>
      <div class="input-dimension">
        <div>
          ${icon('scaleX')}
          <input data-ref="inputWidth" type="number" value="30" min="8" max="200"/>
        </div>
        <div>
          ${icon('scaleY')}
          <input data-ref="inputHeight" type="number" value="30" min="8" max="200"/>
        </div>
      </div>
      <div data-ref="pad" class="pad fake-img">
        <span>Pinch to change dimensions</span>
      </div>
      <hr/>
      <label>Title</label>
      <input data-ref="inputName" type="text" placeholder="Set a title..." required/>
      <hr/>
      <div class="form-actions">
        <button>Create</button>
      </div>
    </div>
  </form>
`;
let CreateComponent = class CreateComponent extends PageComponent {
    title = 'Create a project - minimator';
    constructor() {
        super(template);
        const inputWidth = this.refs.get('inputWidth');
        const inputHeight = this.refs.get('inputHeight');
        const inputName = this.refs.get('inputName');
        inputWidth.value = '30';
        inputHeight.value = '30';
        const vals = { x: 30, y: 30 };
        // Get the pad
        const pad = this.refs.get('pad');
        const gestures = new TouchController(pad, true);
        gestures.on((type, state, data) => {
            if (type !== GESTURE.SCALE) {
                return;
            }
            if (state === STATE.START) {
                vals.x = parseInt(inputWidth.value, 10);
                vals.y = parseInt(inputHeight.value, 10);
            }
            else if (state === STATE.UPDATE) {
                /**
                 *      0 - PI/8    : x
                 *   PI/8 - 3 PI/8  : x + y
                 * 3 PI/8 - 5 PI/8  :     y
                 * 5 PI/8 - 7 PI/8  : x + y
                 * 7 PI/8 - 8 PI/8  : x
                 */
                const directionBy8 = (Math.abs(data?.angle || 0) / Math.PI) * 8;
                const xOn = directionBy8 < 3 || directionBy8 > 5;
                const yOn = directionBy8 > 1 && directionBy8 < 7;
                const scale = data?.scale || 1;
                inputWidth.value = `${(vals.x * (xOn ? scale : 1)).toFixed()}`;
                inputHeight.value = `${(vals.y * (yOn ? scale : 1)).toFixed()}`;
            }
        });
        // Listen for submit
        const form = this.refs.get('form');
        form.addEventListener('submit', e => {
            // Prevent submitting the form
            e.preventDefault();
            // Get item data
            const canvasWidth = parseInt(inputWidth.value, 10);
            const canvasHeight = parseInt(inputHeight.value, 10);
            const canvasName = inputName.value;
            // Create a new item in store
            const storeItem = store.createItem(canvasName, {
                width: canvasWidth,
                height: canvasHeight,
                thickness: 3,
                content: ''
            });
            // Redirect
            window.location.hash = `#/project/${storeItem.id}`;
            return false;
        });
    }
};
CreateComponent = __decorate([
    Component('create-page', './src/components/create/create.style.css')
], CreateComponent);
export { CreateComponent };
