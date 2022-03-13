import Reactive from "../src/Reactive";

const reactive = new Reactive();

describe("createEffect number", () => {
  test("number signal", () => {
    reactive.createRoot(() => {
      const [signal, setSignal] = reactive.createSignal<number>(0);
      setSignal(1);
      reactive.createEffect(() => {
        expect(signal()).toBe(1);
      });
    });
  });

  test("number signal + effect times", () => {
    reactive.createRoot(() => {
      const [signal, setSignal] = reactive.createSignal<number>(0);
      let times = 0;
      setSignal(1);
      reactive.createEffect(() => {
        expect(signal()).toBe(1);
        times++;
      });
      expect(times).toBe(1);
    });
  });
});

describe("createEffect array number", () => {
  test("array number signal", () => {
    reactive.createRoot(() => {
      const [signal, setSignal] = reactive.createSignal<number[]>([0]);
      setSignal([1]);
      reactive.createEffect(() => {
        expect(signal()).toStrictEqual([1]);
      });
    });
  });

  test("array number signal function + effect times", () => {
    reactive.createRoot(() => {
      const [signal, setSignal] = reactive.createSignal<number[]>([0]);
      let times = 0;
      setSignal((signal) => signal.concat(1));
      reactive.createEffect(() => {
        expect(signal()).toStrictEqual([0, 1]);
        times++;
      });
      expect(times).toBe(1);
    });
  });
});

describe("createEffect obj", () => {
  test("obj signal", () => {
    reactive.createRoot(() => {
      const [signal, setSignal] = reactive.createSignal({ a: 0 });
      setSignal({ a: 1 });
      reactive.createEffect(() => {
        expect(signal()).toStrictEqual({ a: 1 });
      });
    });
  });

  test("obj signal function + effect times", () => {
    reactive.createRoot(() => {
      const [signal, setSignal] = reactive.createSignal({ a: 0 });
      let times = 0;
      setSignal({ a: 1 });
      reactive.createEffect(() => {
        expect(signal()).toStrictEqual({ a: 1 });
        times++;
      });
      expect(times).toBe(1);
    });
  });
});
