import { Application, Assets, Sprite, Texture } from 'pixi.js';
import ActiveButton from '../../assets/spin-button.png';
import HoverButton from '../../assets/spin-button-hover.png';
import { down, over, $isPointerDown, $isPointerOver } from './model';

const activeBtn = Assets.load(ActiveButton);
const hoverBtn = Texture.from(HoverButton);

export const loadActiveBtn = (app: Application, spin: () => void) => {
  activeBtn
    .then((texture) => {
      const button = new Sprite(texture);
      button.position.set(app.screen.width / 2, 600);
      button.anchor.set(0.5);
      button.interactive = true;
      button.cursor = 'pointer';

      button
        .on('pointerdown', onButtonDown)
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);

      function onButtonDown() {
        down(true);
        this.texture = hoverBtn;
        spin();
      }

      function onButtonUp() {
        down(false);
        if ($isPointerOver.getState() === true) {
          this.texture = hoverBtn;
        } else {
          this.texture = texture;
        }
      }

      function onButtonOver() {
        over(true);
        if (this.isdown) {
          return;
        }
        this.texture = hoverBtn;
      }

      function onButtonOut() {
        over(false);
        if ($isPointerDown.getState() === true) {
          return;
        }
        this.texture = texture;
      }

      app.stage.addChild(button);
    })
    .catch((e) => console.log(`Button component error: ${e}`));
};
