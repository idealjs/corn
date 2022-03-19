import Reactive from "@idealjs/corn-reactive";

const reactive = new Reactive();

export const createSignal = reactive.createSignal;
export const createDiffSignal = reactive.createDiffSignal;
export const useMemo = reactive.useMemo;
export const useEffect = reactive.useEffect;
