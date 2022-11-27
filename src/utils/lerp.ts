/**
 * a - The starting value.
 * b - The destination value.
 * n - The normal value (between 0 and 1) to control the Linear Interpolation.
 *
 * The closer your normal is to 0 the smoother will be the interpolation.
 * The closer your normal is to 1 the sharper will be the interpolation.
 */

function lerp(a: number, b: number, n: number): number {
  return a * (1 - n) + b * n;
}

export default lerp;
