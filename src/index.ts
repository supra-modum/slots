import { Application } from 'pixi.js';

const app = new Application({
  view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
  background: '#a3d9ea',
  width: 800,
  height: 600,
  antialias: true,
});
