/**
 * Handle a stack of event to unde/redo.
 * Behaves like a linear browser navigation.
 */
export class HistoryStack {
  stack: HistoryAction[] = [];
  index = -1;

  add(action: HistoryAction) {
    this.stack[++this.index] = action;
    this.stack.splice(this.index+1); 
  }
  undo() {
    if (!this.canUndo()) {
      return;
    }
    return this.stack[this.index--];
  }
  redo () {
    if (!this.canRedo()) {
      return;
    }
    return this.stack[++this.index];
  }
  canUndo(){
    return this.index >= 0;
  }
  canRedo(){
    return this.index <= (this.stack.length - 2);
  }
}

export enum HistoryActionType {
  ADD,
  REMOVE
}
export interface HistoryAction {
  type: HistoryActionType,
  element: Element,
  position: number;
}

