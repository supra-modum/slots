import {
  $isPlusPointerOver,
  $isPlusPointerDown,
  $isMinusPointerOver,
  $isMinusPointerDown,
} from '../src/store';

describe('add and remove stakes test', () => {
  test('minus stake button test', () => {
    expect($isMinusPointerDown.defaultState).toBe(false);
    expect($isMinusPointerOver.defaultState).toBe(false);

  });

  test('plus stake button test', () => {
    expect($isPlusPointerDown.defaultState).toBe(false);
    expect($isPlusPointerOver.defaultState).toBe(false);
  });
});
