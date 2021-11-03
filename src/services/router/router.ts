import { PageComponent } from '../../components/page.cmp.js';

export interface Route {
  name: string;
  path: RegExp;
  buildView: RouteCallback;
}
type RouteCallback = (args: string[]) => PageComponent | undefined;

export class Router {
  configs: Route[] = [];
  onChange = (newPage?: PageComponent) => {};

  constructor(public isDebugMode = true) {
    this.hashChange = this.hashChange.bind(this);
    window.addEventListener('hashchange', this.hashChange, false);
  }

  addRoute(config: Route) {
    this.configs.push(config);
  }

  getPath() {
    return window.location.hash.substr(1);
  }

  hashChange() {
    const path = this.getPath();
    for (let i = 0; i < this.configs.length; i++) {
      const config = this.configs[i];
      const pathConfig = config.path;
      const exec = pathConfig.exec(path);
      pathConfig.lastIndex = 0;
      if (exec) {
        if (this.isDebugMode) {
          console.info(`New Route: ${config.name}`, exec.slice(1));
        }
        const newPage = config.buildView(exec.slice(1));
        this.onChange(newPage);
        return;
      }
    }
    if (this.isDebugMode) {
      console.info(`No Route found for "${path}"`);
    }
    this.onChange();
  }

  destroy() {
    window.removeEventListener('hashchange', this.hashChange, false);
  }
}
