import { PageComponent } from '../page.cmp.js';
import { store } from '../../store.js';
import { SVG_ICONS } from '../../services/feather.icons.js';
import {
  TouchController,
  GESTURE,
  STATE,
  EventData,
} from '../../services/touchController/touchController.js';

const template = `
  <a class="breadcrumb" href="#/home">☜ homepage</a>
  <h1>Create a new canvas</h1>
  <form class="create-container" data-ref="form">
    <div class="create-column">
      <label>Dimensions</label>
      <div class="input-dimension">
        <div>
          ${SVG_ICONS.scaleX}
          <input data-ref="inputWidth" type="number" value="30" min="8" max="200"/>
        </div>
        <div>
          ${SVG_ICONS.scaleY}
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

export class CreateComponent extends PageComponent {
  constructor() {
    super(template, './src/components/create/create.style.css');

    const inputWidth = this.refs.get('inputWidth') as HTMLInputElement;
    const inputHeight = this.refs.get('inputHeight') as HTMLInputElement;
    const inputName = this.refs.get('inputName') as HTMLInputElement;

    inputWidth.value = '30';
    inputHeight.value = '30';
    const vals = { x: 30, y: 30 };

    // Get the pad
    const pad = this.refs.get('pad') as SVGElement;
    const gestures = new TouchController(pad, true);
    gestures.on((type: GESTURE, state: STATE, data?: EventData) => {
      if (type !== GESTURE.SCALE) {
        return;
      }

      if (state === STATE.START) {
        vals.x = parseInt(inputWidth.value, 10);
        vals.y = parseInt(inputHeight.value, 10);
      } else if (state === STATE.UPDATE) {
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
        console.log('::::::', directionBy8, data?.angle || 0, data?.drag);
        inputWidth.value = `${(vals.x * (xOn ? scale : 1)).toFixed()}`;
        inputHeight.value = `${(vals.y * (yOn ? scale : 1)).toFixed()}`;
      }
    });

    // Listen for submit
    const form = this.refs.get('form') as HTMLFormElement;
    form.addEventListener('submit', e => {
      // Get item data
      const canvasWidth = parseInt(inputWidth.value, 10);
      const canvasHeight = parseInt(inputHeight.value, 10);
      const canvasName = inputName.value;

      // Create a new item in store
      const storeItem = store.createItem(canvasName);
      store.updateItem(storeItem.id, JSON.stringify({
        width: canvasWidth,
        height: canvasHeight,
        content: ''
      }));

      // Redirect
      window.location.hash = `/project/${storeItem.id}`;
    })

  }
}
customElements.define('create-cmp', CreateComponent);
