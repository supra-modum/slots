import { Application } from 'pixi.js';
import * as utils from './index';

function tickerHelper(tweening: any[], app: Application, delta?: number): void {
  app.ticker.add((delta) => {
    const now = Date.now();

    const remove: any[] = [];

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
}

export default tickerHelper;
