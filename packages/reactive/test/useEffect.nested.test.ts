import Reactive from "../src/Reactive";
import waitUntil from "./waitUntil";

const reactive = new Reactive();

describe("global signal, nested useEffect", () => {
  test("nested useEffect", (done) => {
    const [name, setName] = reactive.createSignal<string>();
    let count = 0;

    const effectInner = jest.fn(() => {
      name();
      count = count + 1;
    });

    const effectOuter = jest.fn(() => {
      name();
      reactive.useEffect(effectInner);
    });

    const name1 = "world";

    const name2 = "world world";
    const testCase = async () => {
      setName(name1);
      await waitUntil(() => {
        return !reactive["scheduler"].working;
      });
      expect(effectOuter).toBeCalledTimes(2);
      expect(effectInner).toBeCalledTimes(3);

      setName(name2);
      await waitUntil(() => {
        return !reactive["scheduler"].working;
      });
      expect(effectOuter).toBeCalledTimes(3);
      expect(effectInner).toBeCalledTimes(5);
    };

    reactive.createRoot(() => {
      reactive.useEffect(effectOuter);

      expect(count).toBe(1);

      testCase()
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  test("global signal, nested useEffect, effect return value", (done) => {
    const [name, setName] = reactive.createSignal<string>();
    let count = 0;
    const name1 = "world";
    const name2 = "world world";

    const effectInner = jest
      .fn(() => {
        name();
        count = count + 1;
        return count;
      })
      .mockName("effectInner");

    const effectOuter = jest
      .fn((prev?: number) => {
        if (prev != null && prev >= 1) {
          return 2;
        }
        return reactive.useEffect(effectInner);
      })
      .mockName("effectOuter");

    const testCase = async () => {
      setName(name1);
      await waitUntil(() => {
        return !reactive["scheduler"].working;
      });
      expect(effectOuter).toBeCalledTimes(1);
      expect(effectInner).toBeCalledTimes(2);

      setName(name2);
      await waitUntil(() => {
        return !reactive["scheduler"].working;
      });
      expect(effectOuter).toBeCalledTimes(1);
      expect(effectInner).toBeCalledTimes(3);
    };

    reactive.createRoot(() => {
      reactive.useEffect(effectOuter);
      testCase()
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  }, 20000);

  test("global signal, nested root/useEffect ", (done) => {
    const [name, setName] = reactive.createSignal<string>();
    let count = 0;
    let clean: Function;
    const name1 = "world";
    const name2 = "world world";

    const effectInner = jest
      .fn(() => {
        name();
        count = count + 1;
      })
      .mockName("effectInner");

    const effectOuter = jest
      .fn(() => {
        clean && clean();
        name();
        reactive.createRoot((dispose) => {
          clean = dispose;
          reactive.useEffect(effectInner);
        });
      })
      .mockName("effectOuter");

    const testCase = async () => {
      setName(name1);
      await waitUntil(() => {
        return !reactive["scheduler"].working;
      });
      expect(effectOuter).toBeCalledTimes(2);
      expect(effectInner).toBeCalledTimes(2);

      setName(name2);
      await waitUntil(() => {
        return !reactive["scheduler"].working;
      });
      expect(effectOuter).toBeCalledTimes(3);
      expect(effectInner).toBeCalledTimes(3);
    };

    reactive.createRoot(() => {
      reactive.useEffect(effectOuter);
      testCase()
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  }, 20000);

  test("global signal, nested root/useEffect, effect return value", (done) => {
    const [name, setName] = reactive.createSignal<string>();
    let count = 0;
    const name1 = "world";
    const name2 = "world world";

    const effectInner = jest
      .fn(() => {
        name();
        count = count + 1;
        return count;
      })
      .mockName("effectInner");

    const effectOuter = jest
      .fn((prev?: number) => {
        name();
        if (prev != null && prev >= 1) {
          return 2;
        }
        return reactive.createRoot(() => {
          return reactive.useEffect(effectInner);
        });
      })
      .mockName("effectOuter");

    const testCase = async () => {
      setName(name1);
      await waitUntil(() => {
        return !reactive["scheduler"].working;
      });
      expect(effectOuter).toBeCalledTimes(2);
      expect(effectInner).toBeCalledTimes(2);

      setName(name2);
      await waitUntil(() => {
        return !reactive["scheduler"].working;
      });
      expect(effectOuter).toBeCalledTimes(3);
      expect(effectInner).toBeCalledTimes(3);
    };

    reactive.createRoot(() => {
      reactive.useEffect(effectOuter);
      testCase()
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  }, 20000);
});
