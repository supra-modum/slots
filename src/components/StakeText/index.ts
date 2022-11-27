import * as pixi from 'pixi.js';

const style = new pixi.TextStyle({
  fontFamily: ['Arial', 'Inter'],
  fontSize: 36,
  fontWeight: 'bold',
  fill: '#000000',
});

const createText = (txt: number | string) => new pixi.Text(`${txt}`, style);

export const stake1 = createText('1');
export const stake5 = createText('5');
export const stake10 = createText('10');
export const stake25 = createText('25');
export const stake50 = createText('50');
export const stake100 = createText('100');
