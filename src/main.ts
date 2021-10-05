import { Router } from './services/router/router.js';
import { PageComponent } from './components/page.cmp.js';
import { HomeComponent } from './components/home/home.cmp.js';

let currentPage: PageComponent;

const appRouter = new Router();
appRouter.addRoute({
  name: 'home',
  path: /^(home)?$/gi,
  buildView: () => new HomeComponent(),
});
appRouter.addRoute({
  name: 'create',
  path: /^create$/gi,
  buildView: () =>
    new PageComponent(
      '<h1>create</h1><a href="#project/2">project/2</a><a href="#home">home</a>'
    ),
});
appRouter.addRoute({
  name: 'project',
  path: /^project\/([0-9]+)$/gi,
  buildView: (args) => {
    if (!args || !args[0]) {
      alert("Couldn't retrieve project data");
      window.location.hash = '';
      return;
    }
    return new PageComponent(`<h1>project : ${args[0]}</h1>`);
  },
});
appRouter.onChange = (newPage) => {
  if (!newPage) {
    window.location.hash = '';
    return;
  }
  const pending = currentPage?.exit() || Promise.resolve();
  pending.then(() => {
    // The current page is now ready to be removed
    currentPage?.remove();
    currentPage = newPage;
    document.body.append(newPage);
    return newPage.enter();
  });
};

appRouter.hashChange();
