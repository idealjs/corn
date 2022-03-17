import Reactive from "@idealjs/corn-reactive";

const reactive = new Reactive();

export const createSignal = reactive.createSignal;
export const useDiffSignal = reactive.useDiffSignal;
export const useMemo = reactive.useMemo;
export const useEffect = reactive.useEffect;
