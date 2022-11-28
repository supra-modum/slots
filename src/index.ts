import * as pixi from 'pixi.js';
import { BlurFilter } from '@pixi/filter-blur';
import {
  stake1,
  stake10,
  stake100,
  stake25,
  stake5,
  stake50,
} from './components/TextItem/StakeText';
import { createPlusButton } from './components/PlusButton';
import { createButton } from './components/Button';
import { createMinusButton } from './components/MinusButton';
import { updateStake } from './store/stakes';
import { downSpinEvent, overSpinEvent } from './store/spin';
import * as utils from './utils';
import {
  Apple,
  Bananas,
  Chili,
  Croissant,
  Donut,
  Eggplant,
  Peach,
  SpinDefault,
  SpinHover,
  Strawberry,
  Taco,
} from './manifest';
import { WinText } from './components/TextItem/WinText';
import { createText } from './components/TextItem/TextItemUI';

const app = new pixi.Application({
  view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
  background: utils.Constants.BG_COLOR,
  width: utils.Constants.APP_WIDTH,
  height: utils.Constants.APP_HEIGHT,
  antialias: true,
  hello: true, // version check
});

pixi.Assets.load([
  Apple,
  Bananas,
  Chili,
  Croissant,
  Donut,
  Eggplant,
  Taco,
  Strawberry,
  Peach,
])
  .then(onAssetsLoaded)
  .catch((err) => {
    console.log(`onAssetLoaded handler error: ${err}`);
  });

const reelContainer = new pixi.Container();
let blurFilter = new BlurFilter(0, 1, window.devicePixelRatio);

const tweening: any[] = [];
const reels: any[] = [];
let num = 0;

function onAssetsLoaded() {
  const slotTextures = [
    pixi.Texture.from(Apple),
    pixi.Texture.from(Bananas),
    pixi.Texture.from(Chili),
    pixi.Texture.from(Croissant),
    pixi.Texture.from(Donut),
    pixi.Texture.from(Eggplant),
    pixi.Texture.from(Taco),
    pixi.Texture.from(Strawberry),
    pixi.Texture.from(Peach),
  ];

  // build the reels
  for (let i = 0; i < 5; i++) {
    const rc = new pixi.Container();
    rc.x = i * utils.Constants.REEL_WIDTH;

    reelContainer.addChild(rc);

    const reel = {
      container: rc,
      // @ts-ignore
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur: new pixi.filters.BlurFilter(),
    };

    reel.blur.blurX = 0;
    reel.blur.blurY = 0;

    // instantiates blur filter
    rc.filters = [blurFilter];

    // build the symbols
    for (let j = 0; j < 4; j++) {
      const symbol = new pixi.Sprite(
        slotTextures[Math.floor(Math.random() * slotTextures.length)],
      );

      // scale the symbol to fit symbol area.
      symbol.y = j * utils.Constants.SYMBOL_SIZE;
      symbol.scale.x = symbol.scale.y = Math.min(
        utils.Constants.SYMBOL_SIZE / symbol.width,
        utils.Constants.SYMBOL_SIZE / symbol.height,
      );
      symbol.x = Math.round((utils.Constants.SYMBOL_SIZE - symbol.width) / 2);

      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }
    reels.push(reel);
  }

  app.stage.addChild(reelContainer);

  reelContainer.x = Math.round(
    utils.Constants.APP_WIDTH - utils.Constants.REEL_WIDTH * 6,
  );
  reelContainer.y =
    (utils.Constants.APP_HEIGHT - utils.Constants.SYMBOL_SIZE * 4) / 2;

  const rectMask = new pixi.Graphics();
  rectMask.beginFill(0);
  rectMask.drawRect(0, 0, 1280, 600);
  rectMask.endFill();

  reelContainer.mask = rectMask;
  reelContainer.addChild(rectMask);

  createButton({
    x: utils.Constants.APP_WIDTH / 2,
    y: utils.Constants.BTN_HEIGHT,
    app,
    image: SpinDefault,
    hover: SpinHover,
    down: downSpinEvent,
    over: overSpinEvent,
    action: startPlay,
  });

  WinText.x = 1000;
  WinText.y = utils.Constants.TEXT_HEIGHT;
  app.stage.addChild(WinText);

  let randomWinText = createText(0);
  randomWinText.x = WinText.x + 100;
  randomWinText.y = utils.Constants.TEXT_HEIGHT;
  app.stage.addChild(randomWinText);

  // add stake value text
  const stakeTxt = [stake1, stake5, stake10, stake25, stake50, stake100];
  stakeTxt[num].x = 260;
  stakeTxt[num].y = utils.Constants.TEXT_HEIGHT;
  app.stage.addChild(stakeTxt[num]);

  const plus = createPlusButton({ app });
  const minus = createMinusButton({ app });

  plus.on('click', () => {
    if (num < utils.STAKE_VALUES.length - 1) {
      // wip
      updateStake();
      stakeTxt[num].destroy();
      num++;

      stakeTxt[num].x = 260;
      stakeTxt[num].y = utils.Constants.TEXT_HEIGHT;

      app.stage.addChild(stakeTxt[num]);
    } else if (num === utils.STAKE_VALUES.length - 1) {
      num = utils.STAKE_VALUES.length - 1;
    }
  });

  // TODO: update stake on minus click
  minus.on('click', () => {
    console.log(num);
  });

  // TODO: change to store value
  let running = false;

  function startPlay() {
    if (running) return;
    running = true;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      // applies blur filter
      r.filters = [blurFilter];
      blurFilter.blurYFilter.strength = 3;

      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2500 + i * 600 + extra * 600;
      utils.tweenToFunction(
        r,
        'position',
        target,
        time,
        utils.backout(0.5),
        null,
        i === reels.length - 1 ? reelsComplete : null,
        tweening,
      );
    }

    setTimeout(() => {
      randomWinText.destroy();

      let gainValue =
        Math.floor(Math.random() * 10) + Number(randomWinText.text);

      randomWinText = createText(
        `${gainValue <= 9999 ? gainValue : 'enough is enough'}`,
      );
      randomWinText.x = WinText.x + 100;
      randomWinText.y = utils.Constants.TEXT_HEIGHT;

      app.stage.addChild(randomWinText);
    }, 4000);

    setTimeout(() => {
      for (let i = 0; i < reels.length; i++) {
        blurFilter.blurYFilter.strength = 1;
      }
    }, 2000);
  }

  // Reels done handler.
  function reelsComplete() {
    running = false;
    blurFilter.blurYFilter.strength = 0;
  }

  // Listen for animate update.
  app.ticker.add((delta) => {
    // Update the slots.
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      // Update blur filter y amount based on speed.
      // This would be better if calculated with time in mind also. Now blur depends on frame rate.
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;

      // Update symbol positions on reel.
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevy = s.y;
        s.y =
          ((r.position + j) % r.symbols.length) * utils.Constants.SYMBOL_SIZE -
          utils.Constants.SYMBOL_SIZE;
        if (s.y < 0 && prevy > utils.Constants.SYMBOL_SIZE) {
          // Detect going over and swap a texture.
          // This should in proper product be determined from some logical reel.
          s.texture =
            slotTextures[Math.floor(Math.random() * slotTextures.length)];
          s.scale.x = s.scale.y = Math.min(
            utils.Constants.SYMBOL_SIZE / s.texture.width,
            utils.Constants.SYMBOL_SIZE / s.texture.height,
          );
          s.x = Math.round((utils.Constants.SYMBOL_SIZE - s.width) / 2);
        }
      }
    }
  });
}

utils.tickerHelper(tweening, app);
