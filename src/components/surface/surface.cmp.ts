import { GESTURE, STATE, EventData } from '../../services/touchController/touchController.js';
import { HistoryStack, HistoryActionType } from '../../services/historyStack/historyStack.js';
import { BaseComponent, Component } from '../base.cmp.js';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

interface Coordinate {
  x: number;
  y: number;
}

export enum SurfaceMode {
  PEN_MODE = 1,
  ERASER_MODE = 2
}

@Component('surface-cmp', './src/components/surface/surface.style.css')
export class SurfaceComponent extends BaseComponent {
  history = new HistoryStack;
  mode: SurfaceMode = SurfaceMode.PEN_MODE;
  el: SVGElement;
  dots: SVGGElement;
  content: SVGGElement;
  
  width = 0;
  height = 0;
  scale = 1;
  gap = 20;

  thickness = 3;
  viewBox = [0, 0, 100, 100];
  rect = new DOMRect();
  drawingStartPoint?: Coordinate;
  fngPoint?: Coordinate;

  currentElement?: SVGLineElement | SVGPathElement;

  constructor(width: number, height: number, content = '') {
    const gap = 20;
    const template = `
      <svg data-ref="svg" xmlns="http://www.w3.org/2000/svg" class="surface">
        <defs>
          <pattern width="${100 / width}%" height="${100 / height}%" viewBox="0,0,${gap},${gap}" id="dot">
            <circle cx="${0.5 * gap}" cy="${0.5 * gap}" r="1" fill="#000"></circle>
          </pattern>
        </defs>
        <rect data-ref="dots" x="0" y="0" width="${width * gap}" height="${height * gap}" style="fill: url('#dot'); display: inherit;"></rect>
        <g data-ref="content" stroke="black" stroke-linecap="round" fill="none" stroke-width="3"></g>
      </svg>
    `;

    super(template);

    this.width = width;
    this.height = height;

    // Save referenced elements
    this.el = this.refs.get('svg') as SVGElement;
    this.dots = this.refs.get('dots') as SVGGElement;
    this.content = this.refs.get('content') as SVGGElement;

    this.content.innerHTML = content;

    // Set defaults
    this.setThickness(3);

    // Bind listener
    this.eventInput = this.eventInput.bind(this);
  }

  setDefaultViewBox() {
    const viewBox = [
      0,
      0,
      this.gap * this.width,
      this.gap * this.height
    ];
    this.el.setAttribute('viewBox', viewBox.join(' '));
  }

  onResize() {
    // const rect = this.getBoundingClientRect();
    this.rect = {
      width: window.innerWidth,
      height: window.innerHeight
    } as DOMRect;

    const padding = 3;

    const cWidth = this.gap * (this.width + 2 * padding);
    const cHeight = this.gap * (this.height + 2 * padding);
    const cRatio = cWidth / cHeight;

    const wWidth = this.rect.width;
    const wHeight = this.rect.height;
    const wRatio = wWidth / wHeight;

    if (cRatio > wRatio) {
      this.viewBox = [
        -padding * this.gap,
        -padding * this.gap -cHeight * ((1/wRatio)/(1/cRatio)-1) / 2,
        cWidth,
        cHeight * ((1/wRatio)/(1/cRatio)),
      ];
    } else {
      this.viewBox = [
        -padding * this.gap -cWidth * (wRatio/cRatio - 1) / 2,
        -padding * this.gap,
        cWidth * (wRatio/cRatio ),
        cHeight,
      ];
    }

    this.el.setAttribute('viewBox', this.viewBox.join(' '));
    this.scale = this.viewBox[2] / this.rect.width;
  }

  eventInput(type: GESTURE, state: STATE, data?: EventData) {
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
      } else if (state === STATE.END) {
        const viewBox = this.el.getAttribute('viewBox');
        if (viewBox) {
          this.viewBox = viewBox.split(' ').map((x) => parseInt(x, 10));
          this.el.setAttribute('viewBox', this.viewBox.join(' '));
          this.scale *= 1 / dataScale;
        }
      }
    } else if (type === GESTURE.DRAG) {
      if (!data) {
        return;
      }

      if (state === STATE.START) {
        this.drawingStartPoint = this.coordToDot(data.origin);
        this.fngPoint = this.drawingStartPoint;
        console.log('SET', this.fngPoint);
      } else if (!this.drawingStartPoint) {
        console.log('ABORTED');
        return;
      } else if (state === STATE.UPDATE) {
        // Find the closest dot to where the finger is
        const fngPoint = this.coordToDot({
          x: data.origin.x + data.drag.x,
          y: data.origin.y + data.drag.y,
        });
        if (!fngPoint || !this.fngPoint) {
          return;
        }

        // Trigger update if the finger is different than the stored one
        if (fngPoint.x !== this.fngPoint.x || fngPoint.y !== this.fngPoint.y) {
          this.fngPoint = fngPoint;
          const vector = {
            x: this.fngPoint.x - this.drawingStartPoint.x,
            y: this.fngPoint.y - this.drawingStartPoint.y,
          };
          const abxVector = {
            x: Math.abs(vector.x),
            y: Math.abs(vector.y),
          };
          // console.log(vector);
          // return;

          if (abxVector.x < abxVector.y / 2) {
            this.makeLine();
          } else if (abxVector.y < abxVector.x / 2) {
            this.makeLine();
          } /* if (Math.abs(vector.x) == Math.abs(vector.y)) */ else {
            this.makeRound(data.drag);
          } /* else {
            return;
          }*/
        }
      } else if (state === STATE.END) {
        if (this.currentElement) {
          this.currentElement.classList.remove('pending');
          this.history.add({
            type: HistoryActionType.ADD,
            element: this.currentElement,
            position: this.content.children.length
          })
        }
        console.log('RESETED');
        this.currentElement = undefined;
        this.drawingStartPoint = undefined;
        this.fngPoint = undefined;
      }
    } else if (type === GESTURE.UNDO && state === STATE.END) {
      this.undo()
    }
  }

  undo() {
    const action = this.history.undo();
    console.log(':undo:',action);
    if (!action) {
      return;
    }
    switch(action.type) {
      case HistoryActionType.ADD:
        this.content.removeChild(action.element);
        break;
      case HistoryActionType.REMOVE:
        if (action.position >= this.content.children.length) {
          this.content.appendChild(action.element);
        } else {
          this.content.insertBefore(action.element, this.content.children[action.position]);
        }
    }
  }

  redo() {
    const action = this.history.redo();
    console.log(':redo:',action);
      if (!action) {
        return;
      }
      switch(action.type) {
        case HistoryActionType.REMOVE:
          this.content.removeChild(action.element);
          break;
        case HistoryActionType.ADD:
          if (action.position >= this.content.children.length) {
            this.content.appendChild(action.element);
          } else {
            this.content.insertBefore(action.element, this.content.children[action.position]);
          }
      }
  }

  coordToPoint(scrOriginPx: EventData['origin']) {
    return {
      x: this.viewBox[0] + this.viewBox[2] * (scrOriginPx.x / this.rect.width),
      y: this.viewBox[1] + this.viewBox[3] * (scrOriginPx.y / this.rect.height),
    };
  }

  coordToDot(scrOriginPx: EventData['origin']) {
    const cnvOriginPx = this.coordToPoint(scrOriginPx);
    const cnvWidth = this.gap * this.width;
    const cnvHeight = this.gap * this.height;
    if (
      cnvOriginPx.x < 0 ||
      cnvOriginPx.x > cnvWidth ||
      cnvOriginPx.y < 0 ||
      cnvOriginPx.y > cnvHeight
    ) {
      return;
    }
    cnvOriginPx.x = Math.floor(cnvOriginPx.x / this.gap);
    cnvOriginPx.y = Math.floor(cnvOriginPx.y / this.gap);
    return cnvOriginPx;
  }

  makeLine() {
    if (!this.drawingStartPoint || !this.fngPoint) {
      return;
    }
    if (this.currentElement) {
      this.currentElement.remove();
    }

    const props = {
      x1: this.drawingStartPoint.x,
      x2: this.fngPoint.x,
      y1: this.drawingStartPoint.y,
      y2: this.fngPoint.y,
    };

    if (Math.abs(props.x2 - props.x1) > Math.abs(props.y2 - props.y1)) {
      props.y2 = props.y1;
    } else {
      props.x2 = props.x1;
    }

    const line = document.createElementNS(SVG_NAMESPACE, 'line');
    line.setAttribute('x1', `${(props.x1 + 0.5) * this.gap}`);
    line.setAttribute('x2', `${(props.x2 + 0.5) * this.gap}`);
    line.setAttribute('y1', `${(props.y1 + 0.5) * this.gap}`);
    line.setAttribute('y2', `${(props.y2 + 0.5) * this.gap}`);
    line.classList.add('pending');
    this.content.appendChild(line);

    this.currentElement = line;
  }

  makeRound(drag: Coordinate) {
    if (!this.drawingStartPoint || !this.fngPoint) {
      return;
    }
    if (this.currentElement) {
      this.currentElement.remove();
    }

    // Find vector on diagonal axis
    const vector = {
      x: this.fngPoint.x - this.drawingStartPoint.x,
      y: this.fngPoint.y - this.drawingStartPoint.y,
    };
    let maxAxis = Math.max(Math.abs(vector.x), Math.abs(vector.y));
    vector.x = (vector.x > 0 ? 1 : -1) * maxAxis;
    vector.y = (vector.y > 0 ? 1 : -1) * maxAxis;

    // Test if the destination is in the map
    const dest = {
      x: this.drawingStartPoint.x + vector.x,
      y: this.drawingStartPoint.y + vector.y
    };
    
    if (dest.x < 0) {
      maxAxis += dest.x;
    }
    if (dest.y < 0) {
      maxAxis += dest.y;
    }
    if (dest.x >= this.width) {
      maxAxis += (this.width - dest.x - 1);      
    }
    if (dest.y >= this.height) {
      maxAxis += (this.height - dest.y -1);
    }
    vector.x = (vector.x > 0 ? 1 : -1) * maxAxis;
    vector.y = (vector.y > 0 ? 1 : -1) * maxAxis;

    // Define curve points
    const p1 = {
      x: (this.drawingStartPoint.x + 0.5) * this.gap,
      y: (this.drawingStartPoint.y + 0.5) * this.gap,
    };
    const p2 = {
      x: (this.drawingStartPoint.x + vector.x + 0.5) * this.gap,
      y: (this.drawingStartPoint.y + vector.y + 0.5) * this.gap,
    };
    const v = {
      x: p2.x - p1.x,
      y: p2.y - p1.y,
    };

    const derivate = {
      x: drag.x - this.drawingStartPoint.x / this.width,
      y: drag.y - this.drawingStartPoint.y / this.height,
    };
    console.log(derivate);
    // debugger;
    const isA = Math.abs(derivate.x) < Math.abs(derivate.y);
    // M0,10C0,4.478,4.478,0,10,0

    const dA = [
      `M${p1.x},${p1.y}C`,
      `${p1.x},${p1.y + v.y / 2},`,
      `${p1.x + v.x / 2},${p2.y},`,
      `${p2.x},${p2.y}`,
    ].join('');

    const dB = [
      `M${p1.x},${p1.y}C`,
      `${p1.x + v.x / 2},${p1.y},`,
      `${p2.x},${p1.y + v.y / 2},`,
      `${p2.x},${p2.y}`,
    ].join('');

    console.log(isA ? 'dA' : 'dB');

    const path = document.createElementNS(SVG_NAMESPACE, 'path');
    path.setAttribute('d', isA ? dA : dB);
    path.classList.add('pending');
    this.content.appendChild(path);

    this.currentElement = path;
  }

  // Controls
  increaseThickness() {
    return this.setThickness(this.thickness + 1);
  }

  decreaseThickness() {
    return this.setThickness(this.thickness - 1);
  }

  setThickness(thickness: number) {
    this.thickness = Math.min(10, Math.max(1, thickness));
    this.content.setAttribute('stroke-width', `${this.thickness}`);
    return this.thickness;
  }

  toggleGrid() {
    if (this.dots.style.display === 'none') {
      this.dots.style.display = 'inherit';
    } else {
      this.dots.style.display = 'none';
    }
  }

  setMode(mode: SurfaceMode) {
    this.mode = mode;
  }

  // Extract SVG
  extractSVG(margin = 4) {
    const doubleMargin = margin * 2;
    const offset = margin * this.gap;
    const width = (this.width + doubleMargin) * this.gap;
    const height = (this.height + doubleMargin) * this.gap;

    const svg = this.el.cloneNode(true) as SVGElement;
    svg.setAttribute('viewBox', `${-offset},${-offset},${width},${height}`);

    return svg.outerHTML;
  }
}
