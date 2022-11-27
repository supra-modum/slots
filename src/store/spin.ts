import { createEvent, createStore } from 'effector';

const $isPointerDown = createStore<boolean>(false);
const $isPointerOver = createStore<boolean>(false);

export const downSpinEvent = createEvent<boolean>();
export const overSpinEvent = createEvent<boolean>();

$isPointerDown.on(downSpinEvent, (state) => !state);
$isPointerOver.on(overSpinEvent, (state) => !state);
