import { createEvent, createStore } from 'effector';

// +/- button stores and events
export const $isPlusPointerDown = createStore<boolean>(false);
export const $isPlusPointerOver = createStore<boolean>(false);
export const $isMinusPointerDown = createStore<boolean>(false);
export const $isMinusPointerOver = createStore<boolean>(false);

export const downPlusStakesEvent = createEvent<boolean>();
export const overPlusStakesEvent = createEvent<boolean>();
export const downMinusStakesEvent = createEvent<boolean>();
export const overMinusStakesEvent = createEvent<boolean>();

$isPlusPointerDown.on(downPlusStakesEvent, (state) => !state);
$isPlusPointerOver.on(overPlusStakesEvent, (state) => !state);

$isMinusPointerDown.on(downMinusStakesEvent, (state) => !state);
$isMinusPointerOver.on(overMinusStakesEvent, (state) => !state);
