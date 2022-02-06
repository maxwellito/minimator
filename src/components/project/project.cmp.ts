import { Component } from '../base.cmp.js';
import { PageComponent } from '../page.cmp.js';

import { SurfaceComponent, SurfaceMode } from '../surface/surface.cmp.js';
import { ToolbarComponent } from '../toolbar/toolbar.cmp.js';
import { TouchController } from '../../services/touchController/touchController.js';
import { VivusComponent } from '../vivus/vivus.cmp.js';
import { downloader, share, buildPNG } from '../../services/features.js';
import { Shortcut } from '../../services/shortcut/shortcut.js';
import { store } from '../../store.js';

@Component('project-page', './src/components/project/project.style.css')
export class ProjectComponent extends PageComponent {
  
  surface: SurfaceComponent;
  touchHandler: TouchController;
  toolbar: ToolbarComponent;
  shortcutBindings: Shortcut;
  vivusScreen?: VivusComponent;

  constructor(id: number) {
    super('');

    const item = store.getIndex(id);
    const projectData = store.getItem(id) || '{}';
    projectData.thickness = projectData.thickness || 3;

    this.title = `${item?.title} - minimator`;

    const surface = new SurfaceComponent(projectData);
    (window as any).ma = surface; //# Debug purposes
    surface.onResize();
    surface.onChange = () => {
      projectData.content = surface.content.innerHTML;
      store.updateItem(id, projectData);
    }
    surface.style.opacity = '0';
    this.shadowRoot?.appendChild(surface);
    this.surface = surface;

    const shortcutBindings = new Shortcut();
    shortcutBindings.on('undo', () => surface.undo());
    shortcutBindings.on('redo', () => surface.redo());
    shortcutBindings.on('move', (isOn) => surface.setMove(isOn));
    this.shortcutBindings = shortcutBindings;

    const touchHandler = new TouchController(surface.el, false, shortcutBindings);
    touchHandler.on(surface.eventInput);
    window.addEventListener('resize', surface.onResize);
    this.touchHandler = touchHandler;

    const toolbar = new ToolbarComponent(projectData.thickness);
    this.shadowRoot?.appendChild(toolbar);
    toolbar.on((eventName, eventData) => {
      let svgOutput;
      switch (eventName) {
        case 'minus':
          toolbar.setThickness(surface.decreaseThickness());
          projectData.thickness = surface.thickness;
          store.updateItem(id, projectData)
          break;
        case 'plus':
          toolbar.setThickness(surface.increaseThickness());
          projectData.thickness = surface.thickness;
          store.updateItem(id, projectData);
          break;
        case 'grid':
          surface.toggleGrid();
          break;
        case 'vivus':
          svgOutput = surface.extractSVG();
          this.vivusScreen = new VivusComponent(svgOutput.outerHTML, () => {
            this.vivusScreen?.exit().then(() => {
              if (this.vivusScreen) {
                this.shadowRoot?.removeChild(this.vivusScreen);
                this.vivusScreen = undefined;
              }
            });
          });
          this.shadowRoot?.appendChild(this.vivusScreen);
          break;
        case 'eraser':
          const newMode = eventData ? SurfaceMode.ERASER_MODE : SurfaceMode.PEN_MODE;
          surface.setMode(newMode);
          break;
        case 'share':
          buildPNG(surface.extractSVG(2, 3000))
            .then(file => share(
                'minimator, a minimalist graphical editor',
                'https://minimator.app',
                file
              )
            );
          break;
        case 'download':
          svgOutput = surface.extractSVG();
          let filename = `minimator - ${item?.title || 'untitled'}`;
          filename = filename.replace(/[^a-z0-9]/gi, '_');
          downloader(svgOutput.outerHTML, `${filename}.svg`);
          break;
      }
    });
    this.toolbar = toolbar;
  }

  exit() {
    window.removeEventListener('resize', this.surface.onResize);
    this.shortcutBindings.destroy();
    this.toolbar.destroy();
    this.touchHandler.destroy();
    this.surface.destroy();
    
    return super.exit().then(() => {
      if (this.vivusScreen) {
        this.shadowRoot?.removeChild(this.vivusScreen);
        this.vivusScreen = undefined;
      }
    });
  }
}
