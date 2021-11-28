import {
  describe,
  it,
  assert,
  beforeEach,
  afterEach,
  mock,
  spyOn,
  resetAllMocks,
  Mock,
} from '../../tests/lib.js';
import { Router, Route } from './router.js';
import { PageComponent } from '../../components/page.cmp.js';

describe('Router', () => {
  let aelMock: Mock;
  let relMock: Mock;

  let router: Router;
  let onChange: Mock;

  let pageA = new PageComponent('<hr/>');
  let buildViewA = mock(pageA);
  let routeA: Route = {
    name: 'A',
    path: /^a$/gi,
    buildView: buildViewA,
  };

  let pageABis = new PageComponent('<hr/>');
  let buildViewABis = mock(pageABis);
  let routeAbis: Route = {
    name: 'A',
    path: /^a$/gi,
    buildView: buildViewABis,
  };

  let pageB = new PageComponent('<hr/>');
  let buildViewB = mock(pageB);
  let routeB: Route = {
    name: 'B',
    path: /^b\/([0-9]+)$/gi,
    buildView: buildViewB,
  };

  beforeEach(() => {
    aelMock = spyOn(window, 'addEventListener');
    relMock = spyOn(window, 'removeEventListener');

    router = new Router(false);
    router.onChange = onChange = mock();

    routeA.buildView = buildViewA = mock(pageA);
    routeAbis.buildView = buildViewABis = mock(pageABis);
    routeB.buildView = buildViewB = mock(pageB);
  });
  afterEach(() => {
    resetAllMocks();
    router.destroy();
  });

  it('should start listening on hashchange', () => {
    assert(aelMock.calls.length, 1);
    assert(aelMock.calls[0][0], 'hashchange');
    assert(aelMock.calls[0][1], router.hashChange);
  });

  it('should stop listening on hashchange after destroy', () => {
    router.destroy();
    assert(relMock.calls.length, 1);
    assert(relMock.calls[0][0], 'hashchange');
    assert(relMock.calls[0][1], router.hashChange);
  });

  it('should find the first matching route', () => {
    router.addRoute(routeA);
    router.addRoute(routeAbis);
    router.getPath = () => 'a';
    router.hashChange();
    assert(onChange.calls.length, 1);
    assert(onChange.calls[0][0], pageA);
    assert(buildViewA.calls.length, 1);
    assert(buildViewABis.calls.length, 0);
  });

  it('should call the view generator with the right params', () => {
    router.addRoute(routeA);
    router.addRoute(routeB);
    router.getPath = () => 'b/1332';
    router.hashChange();
    assert(onChange.calls.length, 1);
    assert(onChange.calls[0][0], pageB);
    assert(buildViewA.calls.length, 0);
    assert(buildViewB.calls.length, 1);
    assert(buildViewB.calls[0][0][0], '1332');
  });

  it('should reset every route regex after use', () => {
    router.addRoute(routeA);
    router.getPath = () => 'a';
    router.hashChange();
    router.hashChange();
    router.hashChange();
    assert(onChange.calls.length, 3);
    assert(buildViewA.calls.length, 3);
  });

  it('should trigger change even when the new route is not detected', () => {
    router.addRoute(routeA);
    router.getPath = () => 'b';
    router.hashChange();
    assert(onChange.calls.length, 1);
    assert(onChange.calls[0].length, 0);
    assert(buildViewA.calls.length, 0);
  });
});
