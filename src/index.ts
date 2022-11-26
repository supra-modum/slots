import { Application } from 'pixi.js';
import { loadActiveBtn } from './components/button';

const app = new Application({
  view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
  background: '#ddffab',
  width: 1024,
  height: 600,
  antialias: true,
  // @ts-ignore
  sharedLoader: true,
});

loadActiveBtn(app);
