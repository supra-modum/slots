import * as pixi from 'pixi.js';

import Apple from '../assets/apple.png';
import Bananas from '../assets/bananas.png';
import Chili from '../assets/chili.png';
import Croissant from '../assets/croissant.png';
import Donut from '../assets/donut.png';
import Eggplant from '../assets/eggplant.png';
import Taco from '../assets/taco.png';
import Strawberry from '../assets/strawberry.png';
import Peach from '../assets/peach.png';

import lerp from './utils/lerp';
import backout from './utils/backout';

import { loadActiveBtn } from './components/button';

const BG_COLOR = 0xddffab;
const REEL_WIDTH = 180;
const SYMBOL_SIZE = 128;

const app = new pixi.Application({
  view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
  background: BG_COLOR,
  width: 1280,
  height: 640,
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
    rc.x = i * REEL_WIDTH;
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
      symbol.y = j * SYMBOL_SIZE;
      symbol.scale.x = symbol.scale.y = Math.min(
        SYMBOL_SIZE / symbol.width,
        SYMBOL_SIZE / symbol.height,
      );
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }
    reels.push(reel);
  }
  app.stage.addChild(reelContainer);

  reelContainer.y = 200;
  reelContainer.x = 210;

  // Load spin button
  loadActiveBtn(app, startPlay);

  let running = false;

  function startPlay() {
    if (running) return;
    running = true;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2500 + i * 600 + extra * 600;
      tweenTo(
        r,
        'position',
        target,
        time,
        backout(0.5),
        null,
        i === reels.length - 1 ? reelsComplete : null,
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
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          // Detect going over and swap a texture.
          // This should in proper product be determined from some logical reel.
          s.texture =
            slotTextures[Math.floor(Math.random() * slotTextures.length)];
          s.scale.x = s.scale.y = Math.min(
            SYMBOL_SIZE / s.texture.width,
            SYMBOL_SIZE / s.texture.height,
          );
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
        }
      }
    }
  });
}

// Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
const tweening: any[] = [];

function tweenTo(
  object: any,
  property: any,
  target: any,
  time: any,
  easing: any,
  onchange: any,
  oncomplete: any,
) {
  const tween = {
    object,
    property,
    propertyBeginValue: object[property],
    target,
    easing,
    time,
    change: onchange,
    complete: oncomplete,
    start: Date.now(),
  };

  tweening.push(tween);
  return tween;
}

// Listen for animate update.
app.ticker.add((delta) => {
  const now = Date.now();
  const remove = [];
  for (let i = 0; i < tweening.length; i++) {
    const t = tweening[i];
    const phase = Math.min(1, (now - t.start) / t.time);

    t.object[t.property] = lerp(
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
