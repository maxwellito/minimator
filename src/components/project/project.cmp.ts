import { PageComponent } from '../page.cmp.js';

import { SurfaceComponent, SurfaceMode } from '../surface/surface.cmp.js';
import { ToolbarComponent } from '../toolbar/toolbar.cmp.js';
import { TouchController } from '../../services/touchController/touchController.js';
import { downloader, share } from '../../services/features.js';
import { Shortcut } from '../../services/shortcut/shortcut.js';


export class ProjectComponent extends PageComponent {
  constructor(id: string) {
    super('', './src/components/project/project.style.css');

    console.log('Project constructor', id);

    const mySurface = new SurfaceComponent(50, 50);
    (window as any).ma = mySurface; //# Debug purposes
    this.shadowRoot?.appendChild(mySurface);

    const touchHandler = new TouchController(mySurface.el);
    touchHandler.on(mySurface.eventInput);
    window.addEventListener('resize', mySurface.onResize.bind(mySurface));
    setTimeout(() => {
      mySurface.onResize();
    }, 10);

    const shortcutBindings = new Shortcut();
    shortcutBindings.on('undo', () => mySurface.undo());
    shortcutBindings.on('redo', () => mySurface.redo());

    const toolbar = new ToolbarComponent();
    this.shadowRoot?.appendChild(toolbar);
    toolbar.on((eventName, eventData) => {
      let svgOutput;
      switch (eventName) {
        case 'minus':
          toolbar.setThickness(mySurface.decreaseThickness());
          break;
        case 'plus':
          toolbar.setThickness(mySurface.increaseThickness());
          break;
        case 'grid':
          mySurface.toggleGrid();
          break;
        case 'eraser':
          const newMode = eventData ? SurfaceMode.ERASER_MODE : SurfaceMode.PEN_MODE;
          mySurface.setMode(newMode);
          break;
        case 'share':
          svgOutput = mySurface.extractSVG();
          share(
            'minimator',
            'https://maxwellito.github.io/minimator',
            svgOutput
          );
          break;
        case 'download':
          svgOutput = mySurface.extractSVG();
          downloader(svgOutput, 'minimator_demo.svg');
          break;
      }
    });
  }

  exit(): Promise<void> {
    return new Promise((res) => {
      const listener = () => {
        res();
        this.removeEventListener('animationend', listener);
      };
      this.addEventListener('animationend', listener);
      this.classList.add('exit');
    });
  }
}
customElements.define('project-cmp', ProjectComponent);
