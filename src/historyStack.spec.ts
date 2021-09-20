import { describe, it, assert } from './tests/index.js';
import {HistoryStack, HistoryActionType} from './historyStack.js';

const mockActions = [
  {
    element: document.createElement('a'),
    type: HistoryActionType.ADD,
    position: 0
  },
  {
    element: document.createElement('a'),
    type: HistoryActionType.ADD,
    position: 1
  },
  {
    element: document.createElement('a'),
    type: HistoryActionType.ADD,
    position: 2
  },
  {
    element: document.createElement('a'),
    type: HistoryActionType.REMOVE,
    position: 2
  },
  {
    element: document.createElement('a'),
    type: HistoryActionType.ADD,
    position: 2
  }
];

const myHistory = new HistoryStack();

describe('historyStack', () => {
  it('should not be able to perform undo', () => {
    assert(myHistory.canUndo(), false);
  });
  
  it('should not be able to perform redo', () => {
    assert(myHistory.canRedo(), false);
  });
  
  myHistory.add(mockActions[0]);
  myHistory.add(mockActions[1]);
  myHistory.add(mockActions[2]);
  myHistory.add(mockActions[3]);
  myHistory.add(mockActions[4]);
  
  it('should be able to perform undo', () => {
    assert(myHistory.canUndo(), true);
    assert(myHistory.canRedo(), false);
  });
  
  it('should get the last action on undo', () => {
    assert(myHistory.undo(), mockActions[4]);
    assert(myHistory.canRedo(), true);
  });
  
  it('should get the last undo action', () => {
    assert(myHistory.redo(), mockActions[4]);
    assert(myHistory.canRedo(), false);
  });

  it('should redo and revert the whole stack', () => {
    assert(myHistory.undo(), mockActions[4]);
    assert(myHistory.undo(), mockActions[3]);
    assert(myHistory.undo(), mockActions[2]);
    assert(myHistory.undo(), mockActions[1]);
    assert(myHistory.undo(), mockActions[0]);
    assert(myHistory.undo(), undefined);
    assert(myHistory.redo(), mockActions[0]);
    assert(myHistory.redo(), mockActions[1]);
    assert(myHistory.redo(), mockActions[2]);
    assert(myHistory.redo(), mockActions[3]);
    assert(myHistory.redo(), mockActions[4]);
  });

  it('should cancel forward ite and a new one is added', () => {
    assert(myHistory.undo(), mockActions[4]);
    assert(myHistory.undo(), mockActions[3]);
    assert(myHistory.canRedo(), true);
    myHistory.add(mockActions[1]);
    assert(myHistory.canRedo(), false);
  });

  // it('fait rien', () => {});
});
