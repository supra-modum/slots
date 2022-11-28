import * as pixi from 'pixi.js';
import { PlusDefault, PlusHover } from '../../manifest';
import { downPlusStakesEvent, overPlusStakesEvent } from '../../store/stakes';

interface PlusButtonInterface {
  app: pixi.Application;
}

/**
 * Create button with "+" symbol
 * @param params - PlusButtonInterface
 */
export const createPlusButton = (params: PlusButtonInterface): pixi.Sprite => {
  const config = {
    x: 360,
    y: 600,
    image: PlusDefault,
    hover: PlusHover,
    down: downPlusStakesEvent,
    over: overPlusStakesEvent,
  };

  const texture = pixi.Texture.from(config.image);
  const hover = pixi.Texture.from(config.hover);

  const button = new pixi.Sprite(texture);

  button.anchor.set(0.5);
  button.interactive = true;
  button.cursor = 'pointer';

  button.x = config.x;
  button.y = config.y;

  button
    .on('pointerdown', onButtonDown)
    .on('pointerup', onButtonUp)
    .on('pointerupoutside', onButtonUp)
    .on('pointerover', onButtonOver)
    .on('pointerout', onButtonOut);

  function onButtonDown() {
    config.down(true);
    this.texture = hover;
    this.alpha = 1;
  }

  function onButtonUp() {
    config.down(false);
    this.texture = hover;
  }

  function onButtonOver() {
    config.over(true);
    if (this.isdown) {
      return;
    }
    this.texture = hover;
  }

  function onButtonOut() {
    config.over(false);
    if (this.isdown) {
      return;
    }
    this.texture = texture;
  }

  params.app.stage.addChild(button);

  return button;
};
