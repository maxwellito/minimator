export class Storage {
    indexes = [];
    indexKey;
    indexNextId;
    indexBaseKey;
    mapBaseKey;
    lastDate = +Date.now();
    constructor(prefixKey) {
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
        this.indexes.sort((a, b) => a.updated_at > b.updated_at ? -1 : 1);
        return this.indexes;
    }
    saveIndexes() {
        if (this.indexes) {
            localStorage.setItem(this.indexKey, JSON.stringify(this.indexes));
        }
        return this.indexes;
    }
    getIndex(id) {
        return this.loadIndexes().find((x) => x.id === id);
    }
    getItem(id) {
        const contentJSON = localStorage.getItem(this.indexBaseKey + id);
        if (!contentJSON) {
            throw new Error(`Couldn't retrieve the item ${id} from LocalStorage.`);
        }
        return JSON.parse(contentJSON);
    }
    renameItem(id, title) {
        var item = this.getIndex(id);
        if (!item) {
            throw new Error(`Storage: item ${id} not found.`);
        }
        item.title = title;
        this.saveIndexes();
    }
    updateItem(id, content) {
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
    createItem(title, content) {
        let id = this.getNextIndex();
        localStorage.setItem(this.indexNextId, `${id + 1}`);
        const now = this.getDate();
        var item = {
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
        return item;
    }
    deleteItem(id) {
        var itemIndex = this.loadIndexes().findIndex((x) => x.id === id);
        if (!~itemIndex) {
            return null;
        }
        const removedItems = this.indexes.splice(itemIndex, 1);
        localStorage.removeItem(this.indexBaseKey + id);
        this.saveIndexes();
        return removedItems;
    }
    getKey(key) {
        return localStorage.getItem(`${this.mapBaseKey}_${key}`);
    }
    setKey(key, value) {
        localStorage.setItem(`${this.mapBaseKey}_${key}`, value);
    }
    getDate() {
        this.lastDate = Math.max(this.lastDate + 1, +new Date());
        return this.lastDate;
    }
}
