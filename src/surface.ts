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
  moveX = 0;
  moveY = 0;

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
    this.el.style.width = `${this.gap * width}px`;
    this.el.style.height = `${this.gap * height}px`;
    const c = this.gap / 2;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const dot = document.createElementNS(SVG_NAMESPACE, 'circle');
        dot.classList.add('dot');
        dot.setAttribute('cx', `${x * this.gap + c}`);
        dot.setAttribute('cy', `${y * this.gap + c}`);
        dot.setAttribute('r', '1');
        dot.setAttribute('fill', '#0003');
        this.dots.appendChild(dot);
      }
    }
  }

  eventInput(type: GESTURE, state: STATE, data?: EventData) {
    console.log(type, state, data);

    if (type === GESTURE.SCALE) {
      if (!data) {
        return;
      }
      const dataScale = data?.scale || 1;
      if (state === STATE.UPDATE) {
        const scale = this.scale * (1 / dataScale);
        this.el.setAttribute(
          'viewBox',
          `${this.moveX - data.drag.x} 
          ${this.moveY - data.drag.y} 
          ${this.gap * this.width * scale} 
          ${this.gap * this.height * scale}`
        );
      }
      if (state === STATE.END) {
        this.scale *= 1 / dataScale;
        this.moveX -= data.drag.x;
        this.moveY -= data.drag.y;
      }
    }
  }
}
