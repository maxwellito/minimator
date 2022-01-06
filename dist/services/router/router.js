export class Router {
    isDebugMode;
    configs = [];
    onChange = (newPage) => { };
    constructor(isDebugMode = true) {
        this.isDebugMode = isDebugMode;
        this.hashChange = this.hashChange.bind(this);
        window.addEventListener('hashchange', this.hashChange, false);
    }
    addRoute(config) {
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
