import { describe, it, assert, after } from '../../tests/lib.js';
import { Storage } from './storage.js';

describe('Storage', () => {
  const prefixKey = 'trashtest';
  const store = new Storage(prefixKey);

  after(() => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefixKey)) {
        localStorage.removeItem(key);
      }
    }
  });

  it('should throw an error when the prefix key is too short', () => {
    let catchedError: any;
    try {
      new Storage('');
    } catch (e) {
      catchedError = e;
    }
    assert(!!catchedError, true);
    assert(catchedError.message, 'Storage: prefixKey too short');
  });

  it('should retrieve indexes after initialisation', () => {
    const indexes = store.loadIndexes();
    assert(indexes.length, 0);
  });

  it('should create and store new index', () => {
    const item = store.createItem('foo');
    const storeTwo = new Storage(prefixKey);
    const indexesA = store.loadIndexes();
    const indexesB = storeTwo.loadIndexes();
    assert(indexesA.length, indexesB.length);
    assert(store.getIndex(item.id)?.title, item.title);
    assert(storeTwo.getIndex(item.id)?.title, item.title);
  });

  it('should update the content of an index', () => {
    const index = store.createItem('foo');
    store.updateItem(index.id, 'foobar');
    assert(store.getItem(index.id), 'foobar');
  });

  it('should rename an index', () => {
    const index = store.createItem('foo');
    store.renameItem(index.id, 'bar');
    assert(index.title, 'bar');
  });

  it('should delete an index', () => {
    const index = store.createItem('foo');
    const sizePre = store.loadIndexes().length;
    store.deleteItem(index.id);
    const sizePost = store.loadIndexes().length;
    assert(store.getItem(index.id), null);
    assert(sizePre, sizePost + 1);
  });

  it('should content must persist between instances', () => {
    const index = store.createItem('foo');
    store.updateItem(index.id, 'foobar');
    const storeTwo = new Storage(prefixKey);
    assert(storeTwo.getItem(index.id), 'foobar');
  });
});
