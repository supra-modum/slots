import { createEvent, createStore } from 'effector';

export const $isPointerDown = createStore<boolean>(false);
export const $isPointerOver = createStore<boolean>(false);

export const down = createEvent<boolean>();
export const over = createEvent<boolean>();

$isPointerDown.on(down, ((state) => !state));
$isPointerOver.on(over, ((state) => !state));

$isPointerDown.watch(state => console.log(`isPointerDown: ${state}`));
$isPointerOver.watch(state => console.log(`isPointerOver: ${state}`));

