import { Router } from './services/router/router.js';
import { PageComponent } from './components/page.cmp.js';
import { HomeComponent } from './components/home/home.cmp.js';
import { CreateComponent } from './components/create/create.cmp.js';
import { IntroComponent } from './components/intro/intro.cmp.js';
import { ProjectComponent } from './components/project/project.cmp.js';
import { securityCheck } from './services/features.js';

// Security 'lol' check
securityCheck();

let currentPage: PageComponent;

const appRouter = new Router();
appRouter.addRoute({
  name: 'home',
  path: /^\/(home)?$/gi,
  buildView: () => new HomeComponent(),
});
appRouter.addRoute({
  name: 'create',
  path: /^\/create$/gi,
  buildView: () => new CreateComponent(),
});
appRouter.addRoute({
  name: 'intro',
  path: /^\/intro$/gi,
  buildView: () => new IntroComponent(),
});
appRouter.addRoute({
  name: 'project',
  path: /^\/project\/([0-9]+)$/gi,
  buildView: (args: string[]) => {
    const id = parseInt(args[0])
    if (isNaN(id) || id < 0) {
      alert("Couldn't retrieve project data");
      window.location.hash = '';
      return;
    }
    return new ProjectComponent(id);
  },
});
appRouter.onChange = (newPage) => {
  if (!newPage) {
    window.location.hash = '/home';
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
