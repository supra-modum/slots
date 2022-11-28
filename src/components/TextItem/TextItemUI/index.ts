import * as pixi from 'pixi.js';

const style = new pixi.TextStyle({
  fontFamily: ['Arial', 'Inter'],
  fontSize: 36,
  fontWeight: 'bold',
  fill: '#000000',
});

export const createText = (txt: number | string) =>
  new pixi.Text(`${txt}`, style);
