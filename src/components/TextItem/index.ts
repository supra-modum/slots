import { TextStyle, Text } from 'pixi.js';

const style = new TextStyle({
  fontFamily: ['Arial', 'Inter'],
  fontSize: 36,
  fontWeight: 'bold',
  fill: '#000000',
});

export const createText = (txt: number | string) => new Text(`${txt}`, style);
