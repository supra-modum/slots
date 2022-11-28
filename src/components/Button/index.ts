import * as pixi from 'pixi.js';

interface ButtonInterface {
  x: number;
  y: number;
  app: pixi.Application;
  image: string | any;
  hover: string | any;
  down: (state: boolean) => void;
  over: (state: boolean) => void;
  action: () => void | null;
}

/**
 * Add spin (start game) button
 * @param params - ButtonInterface
 */
export const createButton = (params: ButtonInterface): void => {
  const texture = pixi.Texture.from(params.image);
  const hover = pixi.Texture.from(params.hover);

  const button = new pixi.Sprite(texture);

  button.anchor.set(0.5);
  button.interactive = true;
  button.cursor = 'pointer';

  button.x = params.x;
  button.y = params.y;

  button
    .on('pointerdown', onButtonDown)
    .on('pointerup', onButtonUp)
    .on('pointerupoutside', onButtonUp)
    .on('pointerover', onButtonOver)
    .on('pointerout', onButtonOut);

  function onButtonDown() {
    params.down(true);
    this.texture = hover;
    this.alpha = 1;
    if (params.action !== null) {
      params.action();
    }
  }

  function onButtonUp() {
    params.down(false);
    this.texture = hover;
  }

  function onButtonOver() {
    params.over(true);
    if (this.isdown) {
      return;
    }
    this.texture = hover;
  }

  function onButtonOut() {
    params.over(false);
    if (this.isdown) {
      return;
    }
    this.texture = texture;
  }

  params.app.stage.addChild(button);
};
