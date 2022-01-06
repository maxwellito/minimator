import { Storage } from './services/storage/storage.js';
import { samples } from './services/samples.js';
export const store = new Storage('minimator-app');
// Add demo samples
if (store.getNextIndex() === 0) {
    samples.forEach(sample => {
        store.createItem(sample.name, sample.data);
    });
}
