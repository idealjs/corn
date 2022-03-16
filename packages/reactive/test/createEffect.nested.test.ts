import Reactive from "../src/Reactive";

const reactive = new Reactive();

describe("createEffect nest", () => {
  test("nested createEffect", () => {
    reactive.createRoot(() => {
      const [name, setName] = reactive.createSignal<string>();
      let count = 0;

      reactive.createEffect(() => {
        name();
        reactive.createEffect(() => {
          name();
          count = count + 1;
        });
      });

      expect(count).toBe(1);

      const name1 = "world";
      setName(name1);
      expect(count).toBe(3);

      const name2 = "world world";
      setName(name2);
      expect(count).toBe(6);
    });
  });

  test("nested createEffect createRoot ", () => {
    reactive.createRoot(() => {
      const [name, setName] = reactive.createSignal<string>();
      let count = 0;

      reactive.createEffect(() => {
        name();
        reactive.createRoot(() => {
          reactive.createEffect(() => {
            name();
            count = count + 1;
          });
        });
      });

      expect(count).toBe(1);

      const name1 = "world";
      setName(name1);
      expect(count).toBe(2);

      const name2 = "world world";
      setName(name2);
      expect(count).toBe(3);
    });
  });
});
