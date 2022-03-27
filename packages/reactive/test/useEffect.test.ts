import Reactive from "../src/Reactive";
import timer from "./timer";

const reactive = new Reactive();

beforeEach(() => {
  jest.useFakeTimers();
});

describe("useEffect number", () => {
  test("number signal + effect times", (done) => {
    const [signal, setSignal] = reactive.createSignal<number>(0);
    reactive.createRoot(() => {
      let times = 0;
      const effectFn = jest.fn(() => {
        expect(signal()).toBe(times);
        times++;
      });
      reactive.useEffect(effectFn);
      setSignal(times);
      jest.advanceTimersByTime(16);

      timer(16)
        .then(() => {
          expect(effectFn).toBeCalledTimes(2);
          expect(times).toBe(2);
          done();
        })
        .catch((err) => {
          done(err);
        });
      jest.advanceTimersByTime(16);
    });
  });
});

describe("useEffect array number", () => {
  test("array number signal function + effect times", (done) => {
    const [signal, setSignal] = reactive.createSignal<number[]>([0]);
    reactive.createRoot(() => {
      let times = [0];
      const effectFn = jest.fn(() => {
        expect(signal()).toStrictEqual(times);
        times = times.concat(times.length);
      });
      reactive.useEffect(effectFn);

      setSignal(times);
      jest.advanceTimersByTime(16);

      timer(16)
        .then(() => {
          console.log("test test");
          expect(effectFn).toBeCalledTimes(2);
          expect(times.length).toBe(3);
          done();
        })
        .catch((err) => {
          done(err);
        });
      jest.advanceTimersByTime(16);
    });
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
  test("number signal", (done) => {
    const [signal, setSignal] = reactive.createSignal<number>(0);
    const [signal2, setSignal2] = reactive.createSignal<number>(0);

    reactive.createRoot(() => {
      const effectFn1 = jest.fn((prev: number = -1) => {
        console.log("1", prev);
        expect(signal2()).toBe(prev + 1);
        return signal2();
      });
      const effectFn2 = jest.fn((prev: number = -1) => {
        console.log("2");
        setSignal2((p) => p + 1);
        console.log("3");
        expect(signal()).toBe(prev + 1);
        return signal();
      });
      reactive.useEffect(effectFn1);

      reactive.useEffect(effectFn2);

      setSignal(1);

      jest.advanceTimersByTime(16);

      timer(16)
        .then(() => {
          console.log("test test");
          expect(effectFn1).toBeCalledTimes(3);
          expect(effectFn2).toBeCalledTimes(2);
          done();
        })
        .catch((err) => {
          done(err);
        });

      jest.advanceTimersByTime(16);
    });
  });
});
