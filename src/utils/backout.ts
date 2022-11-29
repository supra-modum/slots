// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js

export interface BackoutInterface {
  (t: number): number;
}

function backout(amount: number): BackoutInterface {
  return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
}

export default backout;
