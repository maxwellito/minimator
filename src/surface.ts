import { GESTURE, STATE, EventData } from './touchController.js';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

interface Coordinate {
  x: number;
  y: number;
}

export class Surface {
  gap = 20;
  el: SVGElement;
  definitions: SVGDefsElement;
  dots: SVGGElement;
  content: SVGGElement;
  width = 0;
  height = 0;
  scale = 1;
  viewBox = [0, 0, 100, 100];
  rect: any;
  drawingStartPoint?: Coordinate;
  fngPoint?: Coordinate;

  currentElement?: SVGLineElement | SVGPathElement;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.scale = 1;
    this.gap = 20;

    // Create the canvas
    this.el = document.createElementNS(SVG_NAMESPACE, 'svg');
    this.el.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Add dots layer
    const dot = document.createElementNS(SVG_NAMESPACE, 'circle');
    dot.setAttribute('cx', `${0.5 * this.gap}`);
    dot.setAttribute('cy', `${0.5 * this.gap}`);
    dot.setAttribute('r', '1');
    dot.setAttribute('fill', '#000');
    const dotPattern = document.createElementNS(SVG_NAMESPACE, 'pattern');
    dotPattern.setAttribute('width', `${100 / width}%`);
    dotPattern.setAttribute('height', `${100 / height}%`);
    dotPattern.setAttribute('viewBox', `0,0,${this.gap},${this.gap}`);
    dotPattern.id = 'dot';
    dotPattern.appendChild(dot);
    this.definitions = document.createElementNS(SVG_NAMESPACE, 'defs');
    this.definitions.appendChild(dotPattern);
    this.el.appendChild(this.definitions);

    this.dots = document.createElementNS(SVG_NAMESPACE, 'rect');
    this.dots.setAttribute('x', '0');
    this.dots.setAttribute('y', '0');
    this.dots.setAttribute('width', `${width * this.gap}`);
    this.dots.setAttribute('height', `${height * this.gap}`);
    this.dots.style.fill = 'url(#dot)';
    this.el.appendChild(this.dots);

    // Add content layer
    this.content = document.createElementNS(SVG_NAMESPACE, 'g');
    this.el.appendChild(this.content);

    // Bind listener
    this.eventInput = this.eventInput.bind(this);
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
          console.log(vector);
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
          this.content.appendChild(this.currentElement);
        }
        console.log('RESETED');
        this.currentElement = undefined;
        this.drawingStartPoint = undefined;
        this.fngPoint = undefined;
      }
    } else if (type === GESTURE.UNDO && state === STATE.END) {
      if (!this.content.children.length) {
        return;
      }
      this.content.removeChild(
        this.content.children[this.content.children.length - 1]
      );
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
    this.el.appendChild(line);

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
    const maxAxis = Math.max(Math.abs(vector.x), Math.abs(vector.y));
    vector.x = (vector.x > 0 ? 1 : -1) * maxAxis;
    vector.y = (vector.y > 0 ? 1 : -1) * maxAxis;

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
    this.el.appendChild(path);

    this.currentElement = path;
  }
}
