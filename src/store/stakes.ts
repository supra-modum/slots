import { createEvent, createStore } from 'effector';

// button stores and events
const $isPlusPointerDown = createStore<boolean>(false);
const $isPlusPointerOver = createStore<boolean>(false);
const $isMinusPointerDown = createStore<boolean>(false);
const $isMinusPointerOver = createStore<boolean>(false);

export const downPlusStakesEvent = createEvent<boolean>();
export const overPlusStakesEvent = createEvent<boolean>();
export const downMinusStakesEvent = createEvent<boolean>();
export const overMinusStakesEvent = createEvent<boolean>();

$isPlusPointerDown.on(downPlusStakesEvent, (state) => !state);
$isPlusPointerOver.on(overPlusStakesEvent, (state) => !state);

$isMinusPointerDown.on(downMinusStakesEvent, (state) => !state);
$isMinusPointerOver.on(overMinusStakesEvent, (state) => !state);

// wip stakes stores and events
export const updateStake = createEvent();
export const $stakesStore = createStore(0).on(
  updateStake,
  (state) => state + 1,
);

// $stakesStore.watch((state) => console.log(state));
