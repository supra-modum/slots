import { createEvent, createStore } from 'effector';

export const $isRunning = createStore<boolean>(false);
export const gameRunningEvent = createEvent();

$isRunning.on(gameRunningEvent, (state) => !state);
// enable to watch game state on reels spinning
// $isRunning.watch((state) => console.log(`the game is running: ${state}`));
