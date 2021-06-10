import { GESTURE, STATE, EventData } from './touchController.js';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export class Surface {
  gap = 20;
  el: SVGElement;
  dots: SVGGElement;
  content: SVGGElement;
  width = 0;
  height = 0;
  scale = 1;
  viewBox = [0, 0, 100, 100];
  rect: any;

  constructor() {
    this.gap = 20;

    // Create the canvas
    this.el = document.createElementNS(SVG_NAMESPACE, 'svg');

    // Add dots layer
    this.dots = document.createElementNS(SVG_NAMESPACE, 'g');
    this.el.appendChild(this.dots);

    // Add content layer
    this.content = document.createElementNS(SVG_NAMESPACE, 'g');
    this.el.appendChild(this.content);

    // Bind listener
    this.eventInput = this.eventInput.bind(this);
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.scale = 1;

    this.el.setAttribute(
      'viewBox',
      `0 0 ${this.gap * width} ${this.gap * height}`
    );
    const c = this.gap / 2;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const dot = document.createElementNS(SVG_NAMESPACE, 'circle');
        dot.classList.add('dot');
        dot.setAttribute('cx', `${x * this.gap + c}`);
        dot.setAttribute('cy', `${y * this.gap + c}`);
        dot.setAttribute('r', '1');
        dot.setAttribute('fill', '#000');
        this.dots.appendChild(dot);
      }
    }
  }

  onResize() {
    const rect = this.el.getBoundingClientRect();
    const ratio = rect.width / rect.height;
    const square = this.gap * this.width;
    const padding = 0.125;
    const sQ = square * (1 + 2 * padding);

    this.rect = rect;

    if (rect.width > rect.height) {
      this.viewBox = [
        -padding * square - ((ratio - 1) / 2) * sQ,
        -padding * square,
        ratio * sQ,
        sQ,
      ];
    } else {
      const ratioR = 1 / ratio;
      this.viewBox = [
        -padding * square,
        -padding * square - ((ratioR - 1) / 2) * sQ,
        sQ,
        ratioR * sQ,
      ];
    }
    this.el.setAttribute('viewBox', this.viewBox.join(' '));
    this.scale = this.viewBox[2] / rect.width;
  }

  eventInput(type: GESTURE, state: STATE, data?: EventData) {
    // console.log(type, state, data);

    if (type === GESTURE.SCALE) {
      if (!data) {
        return;
      }
      const dataScale = data?.scale || 1;
      if (state === STATE.UPDATE) {
        const opX = data.origin.x / this.rect.width;
        const opY = data.origin.y / this.rect.height;
        const oX = this.viewBox[0] + this.viewBox[2] * opX;
        const oY = this.viewBox[1] + this.viewBox[3] * opY;

        const dragScale = this.scale * (1 / dataScale);

        const viewBox = [
          oX -
            (oX - this.viewBox[0]) * (1 / dataScale) -
            data.drag.x * dragScale,
          oY -
            (oY - this.viewBox[1]) * (1 / dataScale) -
            data.drag.y * dragScale,
          this.viewBox[2] * (1 / dataScale),
          this.viewBox[3] * (1 / dataScale),
        ];
        this.el.setAttribute('viewBox', viewBox.join(' '));
      }
      if (state === STATE.END) {
        const viewBox = this.el.getAttribute('viewBox');
        if (viewBox) {
          this.viewBox = viewBox.split(' ').map((x) => parseInt(x, 10));
          this.el.setAttribute('viewBox', this.viewBox.join(' '));
          this.scale *= 1 / dataScale;
        }
      }
    }
  }
}
