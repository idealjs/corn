import Reactive from "../src/Reactive";

const reactive = new Reactive();

describe("useEffect number", () => {
  test("number signal", () => {
    const [signal, setSignal] = reactive.useSignal<number>(0);
    setSignal(1);
    reactive.useEffect(() => {
      expect(signal()).toBe(1);
    });
  });

  test("number signal + effect times", () => {
    const [signal, setSignal] = reactive.useSignal<number>(0);
    let times = 0;
    setSignal(1);
    reactive.useEffect(() => {
      expect(signal()).toBe(1);
      times++;
    });
    expect(times).toBe(1);
  });
});

describe("useEffect array number", () => {
  test("array number signal", () => {
    const [signal, setSignal] = reactive.useSignal<number[]>([0]);
    setSignal([1]);
    reactive.useEffect(() => {
      expect(signal()).toStrictEqual([1]);
    });
  });

  test("array number signal function + effect times", () => {
    const [signal, setSignal] = reactive.useSignal<number[]>([0]);
    let times = 0;
    setSignal((signal) => signal.concat(1));
    reactive.useEffect(() => {
      expect(signal()).toStrictEqual([0, 1]);
      times++;
    });
    expect(times).toBe(1);
  });
});

describe("useEffect obj", () => {
  test("obj signal", () => {
    const [signal, setSignal] = reactive.useSignal({ a: 0 });
    setSignal({ a: 1 });
    reactive.useEffect(() => {
      expect(signal()).toStrictEqual({ a: 1 });
    });
  });

  test("obj signal function + effect times", () => {
    const [signal, setSignal] = reactive.useSignal({ a: 0 });
    let times = 0;
    setSignal({ a: 1 });
    reactive.useEffect(() => {
      expect(signal()).toStrictEqual({ a: 1 });
      times++;
    });
    expect(times).toBe(1);
  });
});

describe("useEffect number set get", () => {
  test("number signal", () => {
    const [signal, setSignal] = reactive.useSignal<number>(0);
    const [signal2, setSignal2] = reactive.useSignal<number>(0);

    reactive.useEffect((prev: number = -1) => {
      console.log("1");
      setSignal2((p) => p + 1);
      console.log("2");
      expect(signal()).toBe(prev + 1);
      return signal();
    });

    reactive.useEffect((prev: number = 0) => {
      console.log("3");
      expect(signal2()).toBe(prev + 1);
      return signal2();
    });

    setSignal(1);

    console.log("test test");
  });
});
