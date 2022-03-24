import Reactive from "../src/Reactive";

const reactive = new Reactive();

describe("useEffect number", () => {
  test("number signal", () => {
    const [signal, setSignal] = reactive.createSignal<number>(0);
    reactive.createRoot(() => {
      let times = 0;
      reactive.useEffect(() => {
        expect(signal()).toBe(times);
        times++;
      });

      setSignal(times);
    });
  });

  test("number signal + effect times", () => {
    const [signal, setSignal] = reactive.createSignal<number>(0);
    reactive.createRoot(() => {
      let times = 0;
      reactive.useEffect(() => {
        console.log("test test", times);
        expect(signal()).toBe(times);
        times++;
      });
      setSignal(times);

      expect(times).toBe(2);
    });
  });
});

describe("useEffect array number", () => {
  test("array number signal", () => {
    const [signal, setSignal] = reactive.createSignal<number[]>([0]);
    reactive.createRoot(() => {
      let times = [0];
      reactive.useEffect(() => {
        expect(signal()).toStrictEqual(times);
        times = times.concat(times.length);
      });

      setSignal(times);
    });
  });

  test("array number signal function + effect times", () => {
    const [signal, setSignal] = reactive.createSignal<number[]>([0]);
    reactive.createRoot(() => {
      let times = [0];
      reactive.useEffect(() => {
        expect(signal()).toStrictEqual(times);
        times = times.concat(times.length);
      });

      setSignal(times);
      expect(times.length).toBe(3);
    });
  });
});

describe("useEffect obj", () => {
  test("obj signal", () => {
    const [signal, setSignal] = reactive.createSignal({ a: 0 });
    reactive.createRoot(() => {
      setSignal({ a: 1 });
      reactive.useEffect(() => {
        expect(signal()).toStrictEqual({ a: 1 });
      });
    });
  });

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
  test("number signal", () => {
    const [signal, setSignal] = reactive.createSignal<number>(0);
    const [signal2, setSignal2] = reactive.createSignal<number>(0);
    reactive.createRoot(() => {
      reactive.useEffect((prev: number = -1) => {
        console.log("1", prev);
        expect(signal2()).toBe(prev + 1);
        return signal2();
      });

      reactive.useEffect((prev: number = -1) => {
        console.log("2");
        setSignal2((p) => p + 1);
        console.log("3");
        expect(signal()).toBe(prev + 1);
        return signal();
      });

      // setSignal(1);
    });
  });
});
