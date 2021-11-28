import { describe, it, assert, spyOn, resetAllMocks, beforeEach, afterEach } from "../../tests/lib.js";

import { store } from '../../store.js';
import { SurfaceComponent } from '../surface/surface.cmp.js';
import { StorageIndex } from '../../services/storage/storage.js';

import { HomeCardComponent } from "./home-card.cmp.js";
import { ProjectItem } from "../../models/projectItem.js";

describe('HomeCardComponent', () => {
  
  var initialTheme: string;
  var storeOriginal: {[methodName: string]: (...args: any[]) => void} = {};
  var dummyProjectIndex: StorageIndex = {
    id: 2,
    title: 'hope',
    created_at: Date.now(),
    updated_at: Date.now()
  };
  var dummyProjectItem: ProjectItem = {
    width: 10,
    height: 10,
    thickness: 3,
    content: ''
  };

  beforeEach(() => {
    spyOn(store, 'getItem', dummyProjectItem);
    spyOn(store, 'renameItem');
    spyOn(store, 'deleteItem');

    spyOn(window, 'prompt');
    spyOn(window, 'confirm');

    spyOn(SurfaceComponent, 'constructor');
  });
  afterEach(() => {
    resetAllMocks();
  });

  it('should display the create card if no data is given', () => {
    const cmp = new HomeCardComponent();
    assert(!!cmp.refs.get('editButton'), false);
    assert(!!cmp.refs.get('deleteButton'), false);
  });
  
  it('should display the create card if no data is given', () => {
    const cmp = new HomeCardComponent(dummyProjectIndex);
    assert(!!cmp.refs.get('editButton'), true);
    assert(!!cmp.refs.get('deleteButton'), true);
  });

  it('should ask user for confirmation before renaming', () => {
    const cmp = new HomeCardComponent(dummyProjectIndex);
    cmp.refs.get('editButton')?.dispatchEvent(new MouseEvent('click'));
    assert((window.prompt as any).calls.length, 1);
    assert((window.prompt as any).calls[0][0], `Rename "${dummyProjectIndex.title}"`);
    assert((window.prompt as any).calls[0][1], dummyProjectIndex.title);
  });

  it('should not rename if user enter an empty string', () => {
    const cmp = new HomeCardComponent(dummyProjectIndex);
    (window.prompt as any).andReturn('');
    cmp.refs.get('editButton')?.dispatchEvent(new MouseEvent('click'));
    assert(cmp.refs.get('titleLabel')?.innerHTML, dummyProjectIndex.title);
    assert((store.renameItem as any).calls.length, 0);
  });

  it('should rename if user enter a valid name', () => {
    const cmp = new HomeCardComponent(dummyProjectIndex);
    (window.prompt as any).andReturn('fears');
    cmp.refs.get('editButton')?.dispatchEvent(new MouseEvent('click'));
    assert(cmp.refs.get('titleLabel')?.innerHTML, 'fears');
    assert((store.renameItem as any).calls.length, 1);
    assert((store.renameItem as any).calls[0][0], dummyProjectIndex.id);
    assert((store.renameItem as any).calls[0][1], 'fears');
  });

  it('should ask user for confirmation before deleting', () => {
    const cmp = new HomeCardComponent(dummyProjectIndex);
    cmp.refs.get('deleteButton')?.dispatchEvent(new MouseEvent('click'));
    assert((window.confirm as any).calls.length, 1);
    assert((window.confirm as any).calls[0][0], `Are you sure to delete "${dummyProjectIndex.title}"? There's no going back.`);
  });

  it('should delete the item when confirmed', () => {
    const cmp = new HomeCardComponent(dummyProjectIndex);
    spyOn(cmp, 'remove');
    (window.confirm as any).andReturn(true);
    cmp.refs.get('deleteButton')?.dispatchEvent(new MouseEvent('click'));
    assert((store.deleteItem as any).calls.length, 1);
    assert((store.deleteItem as any).calls[0][0], dummyProjectIndex.id);
    assert((cmp.remove as any).calls.length, 1);
  });

  it('should not delete the item when declined', () => {
    const cmp = new HomeCardComponent(dummyProjectIndex);
    spyOn(cmp, 'remove');
    (window.confirm as any).andReturn(false);
    cmp.refs.get('deleteButton')?.dispatchEvent(new MouseEvent('click'));
    assert((store.deleteItem as any).calls.length, 0);
    assert((cmp.remove as any).calls.length, 0);
  });

});