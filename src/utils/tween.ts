function tweenToFunction(
  object: any,
  property: string | any,
  target: number,
  time: number,
  easing: any,
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
