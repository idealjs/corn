import Reactive from "../src/Reactive";
import waitUntil from "./waitUntil";

const reactive = new Reactive();

describe("batch test", () => {
  test("test 1", async () => {
    const [name, setName] = reactive.createSignal<string>();
    const [result, setResult] = reactive.createSignal<string | undefined>(
      name()
    );

    let count = 0;

    const effectFn = jest.fn(() => {
      setResult(name());
      count = count + 1;
    });

    const name1 = "world";
    const name2 = "world world";

    reactive.createRoot(() => {
      reactive.useEffect(effectFn);

      expect(count).toBe(1);

      reactive.batch(() => {
        setName(name1);
        setName(name2);
      });
    });

    await waitUntil(() => {
      return !reactive["scheduler"].working;
    });

    expect(effectFn).toBeCalledTimes(2);
    expect(result()).toBe(name2);
    expect(count).toBe(2);
  });
});
