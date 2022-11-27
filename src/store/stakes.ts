import { createEvent, createStore } from 'effector';

const $isPointerDown = createStore<boolean>(false);
const $isPointerOver = createStore<boolean>(false);

export const downStakesEvent = createEvent<boolean>();
export const overStakesEvent = createEvent<boolean>();

$isPointerDown.on(downStakesEvent, (state) => !state);
$isPointerOver.on(overStakesEvent, (state) => !state);
