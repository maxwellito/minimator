import { describe, it, assert, spyOn, resetAllMocks, beforeEach, afterEach } from "../../tests/lib.js";
import { store } from '../../store.js';
import { SurfaceComponent } from '../surface/surface.cmp.js';
import { HomeCardComponent } from "./home-card.cmp.js";
describe('HomeCardComponent', () => {
    var mockPrompt;
    var mockConfitm;
    var mockRenameItem;
    var mockDeleteItem;
    var dummyProjectIndex = {
        id: 2,
        title: 'hope',
        created_at: Date.now(),
        updated_at: Date.now()
    };
    var dummyProjectItem = {
        width: 10,
        height: 10,
        thickness: 3,
        content: ''
    };
    beforeEach(() => {
        spyOn(store, 'getItem', dummyProjectItem);
        mockRenameItem = spyOn(store, 'renameItem');
        mockDeleteItem = spyOn(store, 'deleteItem');
        mockPrompt = spyOn(window, 'prompt');
        mockConfitm = spyOn(window, 'confirm');
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
        assert(mockPrompt.calls.length, 1);
        assert(mockPrompt.calls[0][0], `Rename "${dummyProjectIndex.title}"`);
        assert(mockPrompt.calls[0][1], dummyProjectIndex.title);
    });
    it('should not rename if user enter an empty string', () => {
        const cmp = new HomeCardComponent(dummyProjectIndex);
        mockPrompt.andReturn('');
        cmp.refs.get('editButton')?.dispatchEvent(new MouseEvent('click'));
        assert(cmp.refs.get('titleLabel')?.innerHTML, dummyProjectIndex.title);
        assert(mockRenameItem.calls.length, 0);
    });
    it('should rename if user enter a valid name', () => {
        const cmp = new HomeCardComponent(dummyProjectIndex);
        mockPrompt.andReturn('fears');
        cmp.refs.get('editButton')?.dispatchEvent(new MouseEvent('click'));
        assert(cmp.refs.get('titleLabel')?.innerHTML, 'fears');
        assert(mockRenameItem.calls.length, 1);
        assert(mockRenameItem.calls[0][0], dummyProjectIndex.id);
        assert(mockRenameItem.calls[0][1], 'fears');
    });
    it('should ask user for confirmation before deleting', () => {
        const cmp = new HomeCardComponent(dummyProjectIndex);
        cmp.refs.get('deleteButton')?.dispatchEvent(new MouseEvent('click'));
        assert(mockConfitm.calls.length, 1);
        assert(mockConfitm.calls[0][0], `Are you sure to delete "${dummyProjectIndex.title}"? There's no going back.`);
    });
    it('should delete the item when confirmed', () => {
        const cmp = new HomeCardComponent(dummyProjectIndex);
        const mockRemove = spyOn(cmp, 'remove');
        mockConfitm.andReturn(true);
        cmp.refs.get('deleteButton')?.dispatchEvent(new MouseEvent('click'));
        assert(mockDeleteItem.calls.length, 1);
        assert(mockDeleteItem.calls[0][0], dummyProjectIndex.id);
        assert(mockRemove.calls.length, 1);
    });
    it('should not delete the item when declined', () => {
        const cmp = new HomeCardComponent(dummyProjectIndex);
        const mockRemove = spyOn(cmp, 'remove');
        spyOn(cmp, 'remove');
        mockConfitm.andReturn(false);
        cmp.refs.get('deleteButton')?.dispatchEvent(new MouseEvent('click'));
        assert(mockDeleteItem.calls.length, 0);
        assert(mockRemove.calls.length, 0);
    });
});
