import Reactive from "../src/Reactive";

const reactive = new Reactive();

describe("useEffect nest", () => {
  test("nested useEffect", () => {
    const [name, setName] = reactive.createSignal<string>();
    reactive.createRoot(() => {
      let count = 0;

      reactive.useEffect(() => {
        name();
        reactive.useEffect(() => {
          name();
          count = count + 1;
        });
      });

      expect(count).toBe(1);

      const name1 = "world";
      setName(name1);
      expect(count).toBe(4);

      const name2 = "world world";
      setName(name2);
      expect(count).toBe(8);
    });
  });

  test("nested root useEffect", () => {
    reactive.createRoot(() => {
      const [name, setName] = reactive.createSignal<string>();
      let count = 0;
      let clean: Function;
      reactive.useEffect(() => {
        clean && clean();
        name();
        reactive.createRoot((dispose) => {
          clean = dispose;
          reactive.useEffect(() => {
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

  test("nested root,global signal useEffect", () => {
    const [name, setName] = reactive.createSignal<string>();

    reactive.createRoot(() => {
      let count = 0;
      let clean: Function;
      reactive.useEffect(() => {
        clean && clean();
        name();
        reactive.createRoot((dispose) => {
          clean = dispose;
          reactive.useEffect(() => {
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
