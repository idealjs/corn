import Reactive from "../src/Reactive";
import waitUntil from "./waitUntil";

let reactive: Reactive;

beforeEach(() => {
  reactive = new Reactive();
});

describe("useEffect number", () => {
  test("number signal + effect times", async () => {
    const [signal, setSignal] = reactive.createSignal<number>(0);
    let times = 0;
    const effectFn = jest.fn(() => {
      expect(signal()).toBe(times);
      times++;
    });

    reactive.createRoot(() => {
      reactive.useEffect(effectFn);
      setSignal(times);
    });

    await waitUntil(() => {
      return !reactive["scheduler"].working;
    });

    expect(effectFn).toBeCalledTimes(2);
    expect(times).toBe(2);
  });
});

describe("useEffect array number", () => {
  test("array number signal function + effect times", async () => {
    const [signal, setSignal] = reactive.createSignal<number[]>([0]);
    let times = [0];
    const effectFn = jest.fn(() => {
      expect(signal()).toStrictEqual(times);
      times = times.concat(times.length);
    });

    reactive.createRoot(() => {
      reactive.useEffect(effectFn);
      setSignal(times);
    });

    await waitUntil(() => {
      return !reactive["scheduler"].working;
    });
    expect(effectFn).toBeCalledTimes(2);
    expect(times.length).toBe(3);
  });
});

describe("useEffect obj", () => {
  test("obj signal function + effect times", () => {
    const [signal, setSignal] = reactive.createSignal({ a: 0 });
    reactive.createRoot(() => {
      let times = 0;
      setSignal({ a: 1 });
      reactive.useEffect(() => {
        expect(signal()).toStrictEqual({ a: 1 });
        times++;
      });
      expect(times).toBe(1);
    });
  });
});

describe("useEffect number set get", () => {
  test("number signal", async () => {
    const [signal, setSignal] = reactive.createSignal<number>(0);
    const [signal2, setSignal2] = reactive.createSignal<number>(0);

    const effectFn1 = jest.fn((prev: number = -1) => {
      expect(signal2()).toBe(prev + 1);
      return signal2();
    });
    const effectFn2 = jest.fn((prev: number = -1) => {
      setSignal2((p) => p + 1);
      expect(signal()).toBe(prev + 1);
      return signal();
    });

    reactive.createRoot(() => {
      reactive.useEffect(effectFn1);
      reactive.useEffect(effectFn2);

      setSignal(1);
    });

    await waitUntil(() => {
      return !reactive["scheduler"].working;
    });

    expect(effectFn1).toBeCalledTimes(3);
    expect(effectFn2).toBeCalledTimes(2);
  });
});
