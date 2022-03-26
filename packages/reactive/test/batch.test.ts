import Reactive from "../src/Reactive";
import timer from "./timer";

const reactive = new Reactive();

beforeEach(() => {
  jest.useFakeTimers();
});

describe("batch test", () => {
  test("test 1", (done) => {
    const [name, setName] = reactive.createSignal<string>();
    const [result, setResult] = reactive.createSignal<string | undefined>(
      name()
    );
    reactive.createRoot(() => {
      let count = 0;

      const effectFn = jest.fn(() => {
        setResult(name());
        count = count + 1;
      });

      reactive.useEffect(effectFn);

      expect(count).toBe(1);

      const name1 = "world";
      const name2 = "world world";

      reactive.batch(() => {
        setName(name1);
        setName(name2);
      });

      jest.advanceTimersByTime(16);
      timer(16).then(() => {
        expect(effectFn).toBeCalledTimes(2);
        expect(result()).toBe(name2);
        expect(count).toBe(2);
        done();
      });
      jest.advanceTimersByTime(16);
    });
  });
});
