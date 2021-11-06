import { Storage } from './services/storage/storage.js';

export interface ProjectItem {
  width: number;
  height: number;
  content: string;
}

export const store: Storage<ProjectItem> = new Storage('minimator-app');
