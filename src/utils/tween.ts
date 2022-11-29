import type { BackoutInterface } from './backout';

function tweenToFunction(
  object: Record<string, any>,
  property: string,
  target: number,
  time: number,
  easing: BackoutInterface,
  onchange: any,
  oncomplete: any,
  tweening?: any[],
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

export default tweenToFunction;
