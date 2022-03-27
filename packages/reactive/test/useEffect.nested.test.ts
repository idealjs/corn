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

  test("global signal, nested root/useEffect ", (done) => {
    const [name, setName] = reactive.createSignal<string>();
    let count = 0;
    let clean: Function;
    const name1 = "world";
    const name2 = "world world";

    const effectInner = jest.fn(() => {
      name();
      count = count + 1;
    });

    const effectOuter = jest.fn(() => {
      clean && clean();
      name();
      reactive.createRoot((dispose) => {
        clean = dispose;
        reactive.useEffect(effectInner);
      });
    });

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
  });

  // test("nested root useEffect", () => {
  //   reactive.createRoot(() => {
  //     const [name, setName] = reactive.createSignal<string>();
  //     let count = 0;
  //     let clean: Function;
  //     reactive.useEffect(() => {
  //       clean && clean();
  //       name();
  //       reactive.createRoot((dispose) => {
  //         clean = dispose;
  //         reactive.useEffect(() => {
  //           name();
  //           count = count + 1;
  //         });
  //       });
  //     });

  //     expect(count).toBe(1);

  //     const name1 = "world";
  //     setName(name1);
  //     expect(count).toBe(2);

  //     const name2 = "world world";
  //     setName(name2);
  //     expect(count).toBe(3);
  //   });
  // });
});
