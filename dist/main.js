import { theme } from './services/theme.js';
import { securityCheck } from './services/features.js';
import { Router } from './services/router/router.js';
import { HomeComponent } from './components/home/home.cmp.js';
import { CreateComponent } from './components/create/create.cmp.js';
import { AboutComponent } from './components/about/about.cmp.js';
import { ProjectComponent } from './components/project/project.cmp.js';
import { MigrateComponent } from './components/migrate/migrate.cmp.js';
// Security 'lol' check
securityCheck();
// Init things
theme.initialisation();
let appContainer;
let currentPage;
const setPage = (newPage) => {
    const page = newPage || new HomeComponent();
    appContainer = appContainer || document.body.querySelector('.app');
    const pending = currentPage?.exit() || Promise.resolve();
    pending.then(() => {
        // The current page is now ready to be removed
        currentPage?.remove();
        currentPage = page;
        appContainer.innerHTML = '';
        appContainer.append(page);
        document.title = page.title;
        return page.enter();
    });
};
if (location.host === 'minimator.app') {
    setPage(new MigrateComponent());
}
else {
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
        name: 'about',
        path: /^\/about$/gi,
        buildView: () => new AboutComponent(),
    });
    appRouter.addRoute({
        name: 'project',
        path: /^\/project\/([0-9]+)$/gi,
        buildView: (args) => {
            const id = parseInt(args[0]);
            if (isNaN(id) || id < 0) {
                alert("Couldn't retrieve project data");
                window.location.hash = '';
                return;
            }
            return new ProjectComponent(id);
        },
    });
    appRouter.onChange = setPage;
    appRouter.hashChange();
}
