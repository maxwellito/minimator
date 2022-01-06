/**
 * Handle a stack of event to unde/redo.
 * Behaves like a linear browser navigation.
 */
export class HistoryStack {
    stack = [];
    index = -1;
    add(action) {
        this.stack[++this.index] = action;
        this.stack.splice(this.index + 1);
    }
    undo() {
        if (!this.canUndo()) {
            return;
        }
        return this.stack[this.index--];
    }
    redo() {
        if (!this.canRedo()) {
            return;
        }
        return this.stack[++this.index];
    }
    canUndo() {
        return this.index >= 0;
    }
    canRedo() {
        return this.index <= (this.stack.length - 2);
    }
}
export var HistoryActionType;
(function (HistoryActionType) {
    HistoryActionType[HistoryActionType["ADD"] = 0] = "ADD";
    HistoryActionType[HistoryActionType["REMOVE"] = 1] = "REMOVE";
})(HistoryActionType || (HistoryActionType = {}));
