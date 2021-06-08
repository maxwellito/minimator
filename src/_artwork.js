const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export class Artwork {
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

    // this.el.addEventListener('mousedown', this.startMove.bind(this));
    // this.el.addEventListener('mousemove', this.updatePoint.bind(this));
    // this.el.addEventListener('mouseup', this.cancelMove.bind(this));

    this.updatePointDefer = this.updatePointDefer.bind(this);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;

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
        dot.setAttribute('cx', x * this.gap + c);
        dot.setAttribute('cy', y * this.gap + c);
        dot.setAttribute('r', 1);
        dot.setAttribute('fill', '#0003');
        this.dots.appendChild(dot);
      }
    }
  }

  /**
   *
   * @returns Coordinates in percentage
   *
   * x: 0.344332032
   * y: 0.143323333
   */
  eventToCoord(e) {
    this.rect = this.rect || this.el.getBoundingClientRect();
    return {
      x: (e.clientX - this.rect.x) / this.rect.width,
      y: (e.clientY - this.rect.y) / this.rect.height,
    };
  }

  /**
   *
   * @returns Dot coordinates
   *
   * x: 12
   * y: 33
   */
  eventToDotCoord(e) {
    this.rect = this.rect || this.el.getBoundingClientRect();
    return {
      x: Math.floor(((e.clientX - this.rect.x) / this.rect.width) * this.width),
      y: Math.floor(
        ((e.clientY - this.rect.y) / this.rect.height) * this.height
      ),
    };
  }

  startMove(e) {
    const coords = this.eventToCoord(e);
    this.currentPoint = this.eventToDotCoord(e);
  }

  updatePoint(e) {
    this.updatePointDeferEvent = e;
    if (this.updatePointDeferReq) {
      return;
    }
    this.updatePointDeferReq = requestAnimationFrame(this.updatePointDefer);
  }

  updatePointDefer() {
    const e = this.updatePointDeferEvent;
    this.updatePointDeferReq = null;
    if (!this.currentPoint) {
      return;
    }

    // Update preview
    const nextPoint = this.eventToDotCoord(e); // this.getTightPoint(e);
    this.nextPoint = this.nextPoint || nextPoint;
    if (nextPoint.x !== this.nextPoint.x || nextPoint.y !== this.nextPoint.y) {
      this.nextPoint = nextPoint;
      const vector = {
        x: this.nextPoint.x - this.currentPoint.x,
        y: this.nextPoint.y - this.currentPoint.y,
      };
      if (!vector.x && vector.y) {
        this.makeLine();
      } else if (vector.x && !vector.y) {
        this.makeLine();
      } else if (Math.abs(vector.x) == Math.abs(vector.y)) {
        this.makeRound(this.eventToCoord(e));
      } else {
        return;
      }
    }

    // Apply preview if ok
    // const tight = this.getTightPoint(e);
    // if (
    //   tight &&
    //   this.currentElement &&
    //   tight.x === this.nextPoint.x &&
    //   tight.y === this.nextPoint.y
    // ) {
    //   this.currentPoint = this.nextPoint;
    //   this.nextPoint = null;
    //   this.content.appendChild(this.currentElement);
    //   this.currentElement = null;
    // }
  }

  makeLine() {
    if (this.currentElement) {
      this.currentElement.remove();
    }

    const line = document.createElementNS(SVG_NAMESPACE, 'line');
    line.setAttribute('x1', (this.currentPoint.x + 0.5) * this.gap);
    line.setAttribute('x2', (this.nextPoint.x + 0.5) * this.gap);
    line.setAttribute('y1', (this.currentPoint.y + 0.5) * this.gap);
    line.setAttribute('y2', (this.nextPoint.y + 0.5) * this.gap);
    this.el.appendChild(line);

    this.currentElement = line;
  }

  makeRound(cursor) {
    if (this.currentElement) {
      this.currentElement.remove();
    }

    const p = 4.478;
    const p1 = {
      x: (this.currentPoint.x + 0.5) * this.gap,
      y: (this.currentPoint.y + 0.5) * this.gap,
    };
    const p2 = {
      x: (this.nextPoint.x + 0.5) * this.gap,
      y: (this.nextPoint.y + 0.5) * this.gap,
    };
    const v = {
      x: p2.x - p1.x,
      y: p2.y - p1.y,
    };

    const derivate = {
      x: cursor.x - this.currentPoint.x / this.width,
      y: cursor.y - this.currentPoint.y / this.height,
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

  cancelMove(e) {
    if (this.currentElement) {
      this.content.appendChild(this.currentElement);
    }
    this.currentPoint = null;
    this.currentElement = null;
    this.nextPoint = null;
    cancelAnimationFrame(this.updatePointDeferReq);
    this.updatePointDeferReq = null;
  }

  getTightPoint(e) {
    const dot = this.eventToCoord(e);
    const xUnit = 1 / this.width;
    const yUnit = 1 / this.height;
    dot.x = Math.abs((dot.x % xUnit) - xUnit / 2);
    dot.y = Math.abs((dot.y % yUnit) - yUnit / 2);

    if (dot.x < 0.002 && dot.y < 0.002) {
      return this.eventToDotCoord(e);
    }
  }
}
