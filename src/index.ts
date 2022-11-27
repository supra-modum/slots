import * as pixi from 'pixi.js';
import * as utils from './utils';
import {
  updateStake,
} from './store/stakes';
import { downSpinEvent, overSpinEvent } from './store/spin';
import {
  Apple,
  Bananas,
  Chili,
  Croissant,
  Donut,
  Eggplant,
  Taco,
  Strawberry,
  Peach,
  SpinDefault,
  SpinHover,
} from './manifest';
import {
  stake1,
  stake5,
  stake10,
  stake25,
  stake50,
  stake100,
} from './components/StakeText';
import { createPlusButton } from './components/PlusButton';
import { createButton } from './components/Button';
import { createMinusButton } from './components/MinusButton';

const app = new pixi.Application({
  view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
  background: utils.Constants.BG_COLOR,
  width: utils.Constants.APP_WIDTH,
  height: utils.Constants.APP_HEIGHT,
  antialias: true,
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
]).then(onAssetsLoaded);

const tweening: any[] = [];

// onAssetsLoaded handler builds the example.
function onAssetsLoaded() {
  // Create different slot symbols.
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

  // Build the reels
  const reels: any[] = [];
  const reelContainer = new pixi.Container();

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
    rc.filters = [reel.blur];

    // Build the symbols
    for (let j = 0; j < 3; j++) {
      const symbol = new pixi.Sprite(
        slotTextures[Math.floor(Math.random() * slotTextures.length)],
      );
      // Scale the symbol to fit symbol area.
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

  reelContainer.y = 200;
  reelContainer.x = 200;

  // add spin (start game) button
  createButton({
    x: utils.Constants.APP_WIDTH / 2,
    y: 600,
    app,
    image: SpinDefault,
    hover: SpinHover,
    down: downSpinEvent,
    over: overSpinEvent,
    action: startPlay,
  });

  let num = 0;

  // add stake value text
  const stakeTxt = [stake1, stake5, stake10, stake25, stake50, stake100];
  stakeTxt[num].x = 260;
  stakeTxt[num].y = utils.Constants.APP_HEIGHT - 60;
  app.stage.addChild(stakeTxt[num]);

  // create and return plus button
  const plus = createPlusButton({ app });

  // create and return minus button
  const minus = createMinusButton({ app });

  plus.on('click', () => {
    if (num < utils.STAKE_VALUES.length - 1) {
      updateStake();
      stakeTxt[num].destroy();
      num++;

      stakeTxt[num].x = 260;
      stakeTxt[num].y = utils.Constants.APP_HEIGHT - 60;
      app.stage.addChild(stakeTxt[num]);
    } else if (num === utils.STAKE_VALUES.length - 1) {
      num = utils.STAKE_VALUES.length - 1;
    }
  });

  // TODO: update stake on minus click
  minus.on('click', () => {
    console.log(num);
  });

  let running = false;

  function startPlay() {
    if (running) return;
    running = true;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
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
  }

  // Reels done handler.
  function reelsComplete() {
    running = false;
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

// Listen for animate update.
app.ticker.add((delta) => {
  const now = Date.now();

  const remove = [];

  for (let i = 0; i < tweening.length; i++) {
    const t = tweening[i];
    const phase = Math.min(1, (now - t.start) / t.time);

    t.object[t.property] = utils.lerp(
      t.propertyBeginValue,
      t.target,
      t.easing(phase),
    );
    if (t.change) t.change(t);
    if (phase === 1) {
      t.object[t.property] = t.target;
      if (t.complete) t.complete(t);
      remove.push(t);
    }
  }

  for (let i = 0; i < remove.length; i++) {
    tweening.splice(tweening.indexOf(remove[i]), 1);
  }
});
