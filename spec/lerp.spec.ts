import lerp from '../src/utils/lerp';

test('lerp test', () => {
  expect(lerp(1, 2, 3)).toBe(4);
});

