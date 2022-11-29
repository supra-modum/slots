import { $isRunning } from '../src/store';

test('game store test', () => {
  expect($isRunning.defaultState).toBe(false);
});
