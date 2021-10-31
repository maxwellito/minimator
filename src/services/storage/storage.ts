export class Storage {
  indexes: StorageIndex[] = [];
  indexKey: string;
  indexNextId: string;
  indexBaseKey: string;

  //# Do the JSON strigify here
  //# Use casting : const st: Storage<MyType> = new Storage();
  constructor(prefixKey: string) {
    if (!prefixKey || prefixKey.length < 5) {
      throw new Error('Storage: prefixKey too short');
    }
    this.indexKey = `${prefixKey}_index`;
    this.indexNextId = `${prefixKey}_nextid`;
    this.indexBaseKey = `${prefixKey}_`;
  }

  loadIndexes() {
    if (!this.indexes.length) {
      this.indexes = JSON.parse(localStorage.getItem(this.indexKey) || '[]');
    }
    this.indexes.sort((a,b) => a.updated_at > b.updated_at ? -1 : 1);
    return this.indexes;
  }

  saveIndexes() {
    if (this.indexes) {
      localStorage.setItem(this.indexKey, JSON.stringify(this.indexes));
    }
    return this.indexes;
  }

  getIndex(id: number) {
    return this.loadIndexes().find((x) => x.id === id);
  }

  getItem(id: number) {
    return localStorage.getItem(this.indexBaseKey + id);
  }

  renameItem(id: number, title: string) {
    var item = this.getIndex(id);
    if (!item) {
      throw new Error(`Storage: item ${id} not found.`);
    }
    item.title = title;
    this.saveIndexes();
  }

  updateItem(id: number, content: string) {
    var item = this.getIndex(id);
    if (!item) {
      throw new Error(`Storage: item ${id} not found.`);
    }
    item.updated_at = +new Date();
    localStorage.setItem(this.indexBaseKey + id, content);
    this.saveIndexes();
  }

  createItem(title: string) {
    let id = parseInt(localStorage.getItem(this.indexNextId) || '0', 10);
    localStorage.setItem(this.indexNextId, `${id + 1}`);

    var item: StorageIndex = {
      id,
      title,
      created_at: +new Date(),
      updated_at: +new Date(),
    };
    this.loadIndexes().push(item);
    this.saveIndexes();
    return item;
  }

  deleteItem(id: number) {
    var itemIndex = this.loadIndexes().findIndex((x) => x.id === id);
    if (!~itemIndex) {
      throw new Error(`Storage: item ${id} not found.`);
    }
    this.indexes.splice(itemIndex, 1);
    localStorage.removeItem(this.indexBaseKey + id);
    this.saveIndexes();
  }
}

export interface StorageIndex {
  id: number;
  title: string;
  created_at: number;
  updated_at: number;
}
export interface StorageItem extends StorageIndex {
  content: string;
}
