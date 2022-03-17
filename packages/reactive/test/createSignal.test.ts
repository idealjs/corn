import Reactive from "../src/Reactive";

const reactive = new Reactive();

describe("createSignal number", () => {
  test("number signal", () => {
    const [signal, setSignal] = reactive.createSignal<number>(0);
    setSignal(1);
    expect(signal()).toBe(1);
  });

  test("number signal function", () => {
    const [signal, setSignal] = reactive.createSignal<number>(0);
    setSignal((signal) => signal + 1);
    expect(signal()).toBe(1);
  });

  test("number signal undefined", () => {
    const [signal, setSignal] = reactive.createSignal<number>();
    setSignal(1);
    expect(signal()).toBe(1);
  });

  test("number signal undefined function", () => {
    const [signal, setSignal] = reactive.createSignal<number>();
    setSignal((signal) => (signal == null ? 1 : 1));
    expect(signal()).toBe(1);
  });
});

describe("createSignal string", () => {
  test("string signal", () => {
    const [signal, setSignal] = reactive.createSignal<string>("0");
    setSignal("1");
    expect(signal()).toBe("1");
  });

  test("string signal function", () => {
    const [signal, setSignal] = reactive.createSignal<string>("0");
    setSignal((signal) => signal + "1");
    expect(signal()).toBe("01");
  });

  test("string signal undefined", () => {
    const [signal, setSignal] = reactive.createSignal<string>();
    setSignal("1");
    expect(signal()).toBe("1");
  });

  test("string signal undefined function", () => {
    const [signal, setSignal] = reactive.createSignal<string>();
    setSignal((signal) => (signal == null ? "1" : "1"));
    expect(signal()).toBe("1");
  });
});

describe("createSignal array number", () => {
  test("array number signal", () => {
    const [signal, setSignal] = reactive.createSignal<number[]>([0]);
    setSignal([1]);
    expect(signal()).toStrictEqual([1]);
  });

  test("array number signal function", () => {
    const [signal, setSignal] = reactive.createSignal<number[]>([0]);
    setSignal((signal) => signal.concat(1));
    expect(signal()).toStrictEqual([0, 1]);
  });

  test("array number signal undefined", () => {
    const [signal, setSignal] = reactive.createSignal<number[]>();
    setSignal([1]);
    expect(signal()).toStrictEqual([1]);
  });

  test("array number signal undefined function", () => {
    const [signal, setSignal] = reactive.createSignal<number[]>();
    setSignal((signal) => (signal == null ? [1] : [1]));
    expect(signal()).toStrictEqual([1]);
  });
});

describe("createSignal array number func ref", () => {
  test("array number signal function", () => {
    const initValue = [0];
    const [signal, setSignal] = reactive.createSignal<number[]>(initValue);
    setSignal((signal) => {
      signal.push(1);
      return signal;
    });
    expect(initValue).toStrictEqual([0, 1]);
    expect(signal()).toEqual(initValue);
  });

  test("array number signal undefined function", () => {
    const [signal, setSignal] = reactive.createSignal<number[]>();
    const newValue = [1];
    setSignal((signal) => (signal == null ? newValue : newValue));
    expect(signal()).toEqual(newValue);
  });
});

describe("createSignal obj", () => {
  test("obj signal", () => {
    const [signal, setSignal] = reactive.createSignal({ a: 0 });
    setSignal({ a: 1 });
    expect(signal()).toStrictEqual({ a: 1 });
  });

  test("obj signal function", () => {
    const [signal, setSignal] = reactive.createSignal({ a: 0 });
    setSignal((signal) => ({ ...signal, a: 1 }));
    expect(signal()).toStrictEqual({ a: 1 });
  });

  test("obj signal undefined", () => {
    const [signal, setSignal] = reactive.createSignal<{
      a: number;
    }>();
    setSignal({ a: 1 });
    expect(signal()).toStrictEqual({ a: 1 });
  });

  test("obj signal undefined function", () => {
    const [signal, setSignal] = reactive.createSignal<{
      a: number;
    }>();
    setSignal((signal) => (signal == null ? { a: 1 } : { a: 1 }));
    expect(signal()).toStrictEqual({ a: 1 });
  });
});

describe("createSignal obj func ref", () => {
  test("obj signal function", () => {
    const initValue = { a: 0 };
    const [signal, setSignal] = reactive.createSignal<{
      a: number;
    }>(initValue);
    setSignal((signal) => {
      signal.a = 1;
      return signal;
    });
    expect(initValue).toStrictEqual({ a: 1 });
    expect(signal()).toEqual(initValue);
  });

  test("obj signal undefined function", () => {
    const [signal, setSignal] = reactive.createSignal<{
      a: number;
    }>();
    const newValue = { a: 1 };
    setSignal((signal) => (signal == null ? newValue : newValue));
    expect(signal()).toEqual(newValue);
  });
});
