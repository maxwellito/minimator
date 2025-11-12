export class Storage<T> {
  indexes: StorageIndex[] = [];
  indexKey: string;
  indexNextId: string;
  indexBaseKey: string;
  mapBaseKey: string;
  lastDate = +Date.now();
  onCreate?: (newItem: StorageIndex)=>void;

  constructor(prefixKey: string) {
    if (!prefixKey || prefixKey.length < 5) {
      throw new Error('Storage: prefixKey too short');
    }
    this.indexKey = `${prefixKey}_index`;
    this.indexNextId = `${prefixKey}_nextid`;
    this.indexBaseKey = `${prefixKey}_`;
    this.mapBaseKey = `${prefixKey}_map_`;
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

  getItem(id: number):T {
    const contentJSON = localStorage.getItem(this.indexBaseKey + id);
    if (!contentJSON) {
      throw new Error(`Couldn't retrieve the item ${id} from LocalStorage.`);
    }
    return JSON.parse(contentJSON);
  }

  renameItem(id: number, title: string) {
    var item = this.getIndex(id);
    if (!item) {
      throw new Error(`Storage: item ${id} not found.`);
    }
    item.title = title;
    this.saveIndexes();
  }

  updateItem(id: number, content: T) {
    var item = this.getIndex(id);
    if (!item) {
      throw new Error(`Storage: item ${id} not found.`);
    }
    item.updated_at = this.getDate();
    const contentJSON = JSON.stringify(content);
    localStorage.setItem(this.indexBaseKey + id, contentJSON);
    this.saveIndexes();
  }

  getNextIndex() {
    return parseInt(localStorage.getItem(this.indexNextId) || '0', 10);
  }

  createItem(title: string, content?: T) {
    let id = this.getNextIndex();
    localStorage.setItem(this.indexNextId, `${id + 1}`);

    const now = this.getDate();
    var item: StorageIndex = {
      id,
      title,
      created_at: now,
      updated_at: now,
    };
    this.loadIndexes().push(item);
    this.saveIndexes();
    if (content) {
      this.updateItem(id, content);
    }
    if (this.onCreate) {
      this.onCreate(item);
    }
    return item;
  }

  deleteItem(id: number) {
    var itemIndex = this.loadIndexes().findIndex((x) => x.id === id);
    if (!~itemIndex) {
      return null;
    }
    const removedItems = this.indexes.splice(itemIndex, 1);
    localStorage.removeItem(this.indexBaseKey + id);
    this.saveIndexes();
    return removedItems;
  }


  getKey(key: string) {
    return localStorage.getItem(`${this.mapBaseKey}_${key}`);
  }

  setKey(key: string, value: string) {
    localStorage.setItem(`${this.mapBaseKey}_${key}`, value);
  }

  getDate() {
    this.lastDate = Math.max(this.lastDate+1, +new Date());
    return this.lastDate;
  }

  export(): string{
    const output:{[key:string]:string|null} = {};
    for(let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        output[key] = localStorage.getItem(key);
      }
    }
    return JSON.stringify(output);
  }

  import(dump: string){
    let input:{[key:string]:string} = JSON.parse(dump);
    localStorage.clear();
    for (let key in input) {
      localStorage.setItem(key, input[key]);
    }
  }
}

export interface StorageIndex {
  id: number;
  title: string;
  created_at: number;
  updated_at: number;
}