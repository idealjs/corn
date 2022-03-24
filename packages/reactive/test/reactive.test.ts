import Reactive from "../src/Reactive";

const reactive = new Reactive();

describe("batch test", () => {
  test("test 1", () => {
    const [name, setName] = reactive.createSignal<string>();
    const [result, setResult] = reactive.createSignal<string | undefined>(
      name()
    );
    reactive.createRoot(() => {
      let count = 0;

      reactive.useEffect(() => {
        setResult(name());
        count = count + 1;
      });

      expect(count).toBe(1);

      const name1 = "world";
      const name2 = "world world";

      reactive.batch(() => {
        setName(name1);
        setName(name2);
      });

      expect(result()).toBe(name2);
      expect(count).toBe(2);
    });
  });
});
