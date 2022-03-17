import Reactive from "@idealjs/corn-reactive";

const reactive = new Reactive();

export const useSignal = reactive.useSignal;
export const useDiffSignal = reactive.useDiffSignal;
export const useMemo = reactive.useMemo;
export const useEffect = reactive.useEffect;
