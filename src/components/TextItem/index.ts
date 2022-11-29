import { TextStyle, Text } from 'pixi.js';

const style = new TextStyle({
  fontFamily: ['system-ui'],
  fontSize: 36,
  fontWeight: 'bold',
  fill: '#131313',
});

export const createText = (txt: number | string) => new Text(`${txt}`, style);
