/**
 * The touch Controller will handle the touch events
 * on the main canvas to handle the basic gestures
 * of a graphical editor on a tablet or desktop.
 *
 * Things to handle:
 * - one finger
 *     tap: nothing
 *     move: draw
 * - double fingers
 *     tap: undo
 *     move: scale
 * - three fingers
 *     tap: redo
 *     move: nothing
 * - more fingers
 *     please zoidberg stop licking that screen
 */
// 100ms is the max time to start/end a gesture
const gestureTransitionTime = 100;
export var GESTURE;
(function (GESTURE) {
    GESTURE[GESTURE["NONE"] = 0] = "NONE";
    GESTURE[GESTURE["TAP"] = 1] = "TAP";
    GESTURE[GESTURE["DRAG"] = 2] = "DRAG";
    GESTURE[GESTURE["UNDO"] = 3] = "UNDO";
    GESTURE[GESTURE["SCALE"] = 4] = "SCALE";
    GESTURE[GESTURE["REDO"] = 5] = "REDO";
    GESTURE[GESTURE["VOID"] = 6] = "VOID";
})(GESTURE || (GESTURE = {}));
export var STATE;
(function (STATE) {
    STATE[STATE["START"] = 0] = "START";
    STATE[STATE["UPDATE"] = 1] = "UPDATE";
    STATE[STATE["END"] = 2] = "END";
    STATE[STATE["NONE"] = 3] = "NONE";
})(STATE || (STATE = {}));
export class TouchController {
    el;
    touchOnly;
    shortcut;
    pointers;
    callbacks;
    lastData;
    currentEvent = GESTURE.NONE;
    gestureMaxTouches = 0;
    shortcutListeners = [];
    constructor(el, touchOnly = false, shortcut) {
        this.el = el;
        this.touchOnly = touchOnly;
        this.shortcut = shortcut;
        // Internals
        this.pointers = new Map();
        this.callbacks = [];
        // Bind listeners
        this.touchstart = this.touchstart.bind(this);
        this.touchmove = this.touchmove.bind(this);
        this.touchend = this.touchend.bind(this);
        this.mousemove = this.mousemove.bind(this);
        this.mousedown = this.mousedown.bind(this);
        this.mouseup = this.mouseup.bind(this);
        this.wheel = this.wheel.bind(this);
        // Start listening
        this.el.addEventListener('touchstart', this.touchstart);
        this.el.addEventListener('touchmove', this.touchmove);
        this.el.addEventListener('touchend', this.touchend);
        this.el.addEventListener('touchcancel', this.touchend);
        if (!touchOnly) {
            // Listen to click and scrolls
            this.el.addEventListener('mousedown', this.mousedown);
            this.el.addEventListener('mousemove', this.mousemove);
            this.el.addEventListener('mouseup', this.mouseup);
            this.el.addEventListener('wheel', this.wheel);
        }
        if (shortcut) {
            shortcut.on('zoomin', () => this.triggerZoom(1.25));
            shortcut.on('zoomout', () => this.triggerZoom(.75));
        }
    }
    on(callback) {
        this.callbacks.push(callback);
    }
    off(callback) {
        const cbIndex = this.callbacks.indexOf(callback);
        if (cbIndex !== -1) {
            this.callbacks.splice(cbIndex, 1);
        }
    }
    //# Create a decorator for this method
    blockEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    // Touch listeners
    touchstart(e) {
        this.blockEvent(e);
        if (this.isCurrentEventDetected()) {
            return;
        }
        for (let i = e.changedTouches.length - 1; i >= 0; i--) {
            let touch = e.changedTouches.item(i);
            this.pointers.set(touch?.identifier || 0, touch);
        }
        this.gestureMaxTouches = e.touches.length;
    }
    touchmove(e) {
        this.blockEvent(e);
        if (this.isCurrentEventDetected()) {
            this.updateCurrentEvent(e);
            return;
        }
        for (let i = e.changedTouches.length - 1; i >= 0; i--) {
            let touch = e.changedTouches.item(i);
            if (!touch) {
                continue;
            }
            let pointer = this.pointers.get(touch.identifier);
            let x = Math.abs(touch.clientX - pointer.clientX);
            let y = Math.abs(touch.clientY - pointer.clientY);
            if (x + y > 20) {
                let { length } = e.touches;
                const defaultData = {
                    origin: {
                        x: 0,
                        y: 0,
                    },
                    drag: {
                        x: 0,
                        y: 0,
                    },
                };
                this.pointers.forEach((p) => {
                    defaultData.origin.x += p.clientX;
                    defaultData.origin.y += p.clientY;
                });
                defaultData.origin.x /= this.pointers.size;
                defaultData.origin.y /= this.pointers.size;
                if (length === 1) {
                    this.setEventType(GESTURE.DRAG, defaultData);
                }
                else if (length === 2) {
                    this.setEventType(GESTURE.SCALE, defaultData);
                }
                else {
                    this.setEventType(GESTURE.VOID);
                }
            }
        }
    }
    touchend(e) {
        this.blockEvent(e);
        for (let i = e.changedTouches.length - 1; i >= 0; i--) {
            let touch = e.changedTouches.item(i);
            if (!touch) {
                continue;
            }
            this.pointers.delete(touch.identifier);
        }
        if (e.touches.length === 0) {
            if (!this.currentEvent /* || this.currentEvent === GESTURE.NONE */) {
                if (this.gestureMaxTouches === 1) {
                    this.setEventType(GESTURE.TAP);
                }
                else if (this.gestureMaxTouches === 2) {
                    this.setEventType(GESTURE.UNDO);
                }
                else {
                    this.setEventType(GESTURE.REDO);
                }
            }
            this.setEventType(GESTURE.NONE);
            this.gestureMaxTouches = 0;
            // TODO clear everything
        }
    }
    // Mouse Listeners
    mousedown(e) {
        this.blockEvent(e);
        const defaultData = {
            origin: {
                x: e.pageX,
                y: e.pageY,
            },
            drag: {
                x: 0,
                y: 0,
            }
        };
        this.setEventType(GESTURE.DRAG, defaultData);
        this.el.addEventListener('mousemove', this.mousemove);
    }
    mousemove(e) {
        this.blockEvent(e);
        if (this.currentEvent === GESTURE.SCALE) {
            this.setEventType(GESTURE.NONE);
        }
        else if (this.currentEvent === GESTURE.DRAG) {
            const data = this.lastData;
            if (!data) {
                return;
            }
            data.drag = {
                x: e.pageX - (data?.origin.x || 0),
                y: e.pageY - (data?.origin.y || 0)
            };
            this.triggerUpdate(data);
        }
    }
    mouseup(e) {
        this.blockEvent(e);
        this.setEventType(GESTURE.NONE);
    }
    wheel(e) {
        this.blockEvent(e);
        // Init gesture
        if (this.currentEvent !== GESTURE.SCALE) {
            this.setEventType(GESTURE.SCALE, {
                origin: { x: e.pageX, y: e.pageY },
                drag: { x: 0, y: 0 },
                scale: 1,
            });
        }
        const { lastData } = this;
        if (!lastData?.drag) {
            return;
        }
        lastData.drag.x -= e.deltaX;
        lastData.drag.y -= e.deltaY;
        this.triggerUpdate(lastData);
    }
    isCurrentEventDetected() {
        return this.currentEvent !== GESTURE.NONE;
    }
    updateCurrentEvent(e) {
        switch (this.currentEvent) {
            case GESTURE.DRAG:
                const b = e.touches.item(0);
                if (!b) {
                    return;
                }
                const a = this.pointers.get(b.identifier);
                this.triggerUpdate({
                    origin: {
                        x: a.clientX,
                        y: a.clientY,
                    },
                    drag: {
                        x: b.clientX - a.clientX,
                        y: b.clientY - a.clientY,
                    },
                });
                break;
            case GESTURE.SCALE:
                const b1 = e.touches.item(0);
                const b2 = e.touches.item(1);
                if (!b1 || !b2) {
                    return;
                }
                const a1 = this.pointers.get(b1.identifier);
                const a2 = this.pointers.get(b2.identifier);
                const output = {
                    origin: {
                        x: (a1.clientX + a2.clientX) / 2,
                        y: (a1.clientY + a2.clientY) / 2,
                    },
                    drag: {
                        x: (b1.clientX + b2.clientX) / 2 - (a1.clientX + a2.clientX) / 2,
                        y: (b1.clientY + b2.clientY) / 2 - (a1.clientY + a2.clientY) / 2,
                    },
                    scale: (Math.abs(b1.clientX - b2.clientX) +
                        Math.abs(b1.clientY - b2.clientY)) /
                        (Math.abs(a1.clientX - a2.clientX) +
                            Math.abs(a1.clientY - a2.clientY)),
                    angle: 0,
                };
                output.angle = Math.atan2(b2.clientY - b1.clientY, b2.clientX - b1.clientX);
                this.triggerUpdate(output);
                break;
        }
    }
    setEventType(eventType, eventData) {
        this.broadcast(STATE.END, this.lastData);
        this.currentEvent = eventType;
        this.lastData = undefined;
        this.broadcast(STATE.START, eventData);
    }
    triggerUpdate(data) {
        this.broadcast(STATE.UPDATE, data);
    }
    broadcast(eventStatus, eventData) {
        const type = this.currentEvent;
        if (type === GESTURE.NONE || type === GESTURE.VOID) {
            return;
        }
        this.lastData = eventData;
        this.callbacks.forEach((cb) => cb(type, eventStatus, eventData));
    }
    triggerZoom(scale) {
        const data = {
            origin: { x: -1, y: -1 },
            drag: { x: 0, y: 0 },
            scale,
        };
        this.setEventType(GESTURE.SCALE, data);
        this.triggerUpdate(data);
    }
    destroy() {
        // Stop listening mouse/touch events
        this.el.removeEventListener('touchstart', this.touchstart);
        this.el.removeEventListener('touchmove', this.touchmove);
        this.el.removeEventListener('touchend', this.touchend);
        this.el.removeEventListener('touchcancel', this.touchend);
        if (!this.touchOnly) {
            this.el.removeEventListener('mousemove', this.mousemove);
            this.el.removeEventListener('mousedown', this.mousedown);
            this.el.removeEventListener('mouseup', this.mouseup);
            this.el.removeEventListener('wheel', this.wheel);
        }
        // Clear listeners
        this.callbacks = [];
    }
}
