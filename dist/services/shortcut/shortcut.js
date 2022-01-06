export class Shortcut {
    listeners = new Map();
    isCtrlMetaOn = false;
    keyupListener;
    keydownListener;
    /**
     * Init the object by listeneing to the key events
     */
    constructor() {
        this.keyupListener = this.onKeyUp.bind(this);
        this.keydownListener = this.onKeyDown.bind(this);
        window.addEventListener('keyup', this.keyupListener);
        window.addEventListener('keydown', this.keydownListener);
    }
    /**
     * Public method to listen keybind
     * @param string eventName Event to listen to
     * @param function listener Listener
     * @return function Executable to remove the listener
     */
    on(eventName, listener) {
        if (![...EVENTS, ...MODIFIERS].find(x => x.name === eventName)) {
            throw new Error('Ask to listen for a non existing shortcut');
        }
        let listeners = this.listeners.get(eventName);
        if (!listeners) {
            listeners = [];
            this.listeners.set(eventName, listeners);
        }
        listeners.push(listener);
        return () => {
            let listeners = this.listeners.get(eventName);
            let listenerIndex = listeners.indexOf(listener);
            if (~listenerIndex) {
                listeners.splice(listenerIndex, 1);
            }
        };
    }
    /**
     * Listener for key up
     * @param event event Event object from window
     */
    onKeyUp(event) {
        this.updateMetaState(event);
        for (let eventSpecs of MODIFIERS) {
            if (event.key === eventSpecs.key) {
                this.dispatch(eventSpecs.name, false);
            }
        }
    }
    /**
     * Listener for key down
     * @param event event Event object from window
     */
    onKeyDown(event) {
        this.updateMetaState(event);
        const key = event.key.toLowerCase();
        // let areSpecsPassing;
        for (let eventSpecs of EVENTS) {
            if (eventSpecs.key === key &&
                (eventSpecs.ctrlKey === undefined || eventSpecs.ctrlKey === this.isCtrlMetaOn) &&
                (eventSpecs.shiftKey === undefined || eventSpecs.shiftKey === event.shiftKey)) {
                this.dispatch(eventSpecs.name);
                event.preventDefault();
                return;
            }
        }
        for (let eventSpecs of MODIFIERS) {
            if (event.key === eventSpecs.key) {
                this.dispatch(eventSpecs.name, true);
            }
        }
    }
    updateMetaState(event) {
        const isCtrlMetaOn = event.ctrlKey || event.metaKey;
        if (this.isCtrlMetaOn === isCtrlMetaOn) {
            return;
        }
        // Set the new state
        this.isCtrlMetaOn = isCtrlMetaOn;
        this.dispatch('ctrl', isCtrlMetaOn);
    }
    dispatch(eventName, isOn) {
        let listeners = this.listeners.get(eventName) || [];
        for (let listenerIndex in listeners) {
            listeners[listenerIndex](isOn);
        }
    }
    /**
     * Public method to remove all events
     * to make the instance killable
     */
    destroy() {
        window.removeEventListener('keyup', this.keyupListener);
        window.removeEventListener('keydown', this.keydownListener);
        this.listeners.clear();
    }
}
export const EVENTS = [
    {
        name: 'redo',
        key: 'y',
        ctrlKey: true,
    },
    {
        name: 'redo',
        key: 'z',
        ctrlKey: true,
        shiftKey: true,
    },
    {
        name: 'undo',
        key: 'z',
        ctrlKey: true,
    },
    {
        name: 'delete',
        key: 'backspace',
    },
    {
        name: 'cut',
        key: 'x',
        ctrlKey: true,
    },
    {
        name: 'copy',
        key: 'c',
        ctrlKey: true,
    },
    {
        name: 'paste',
        key: 'v',
        ctrlKey: true,
    },
    {
        name: 'zoomin',
        key: '+',
        ctrlKey: true,
    },
    {
        name: 'zoomin',
        key: '=',
        ctrlKey: true,
    },
    {
        name: 'zoomout',
        key: '-',
        ctrlKey: true,
    },
];
const MODIFIERS = [
    {
        name: 'move',
        key: ' ',
    }
];
