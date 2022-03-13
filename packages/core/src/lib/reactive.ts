import Reactive from "@idealjs/corn-reactive";

const reactive = new Reactive();

export const createRoot = reactive.createRoot;
export const createSignal = reactive.createSignal;
export const createDiffSignal = reactive.createDiffSignal;
export const createMemo = reactive.createMemo;
export const createEffect = reactive.createEffect;
