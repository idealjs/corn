import Reactive from "../src/Reactive";
import { FLAG, WithFlag } from "../src/type";

const reactive = new Reactive();

describe("createDiffSignal test", () => {
  test("test 3", () => {
    reactive.createRoot(() => {
      const [todos, setTodos] = reactive.createDiffSignal<WithFlag<string>[]>(
        []
      );
      let array: string[] = [];
      reactive.createEffect(() => {
        expect(todos().map((t) => t.data)).toEqual(array);
      });

      const data1 = Math.random().toFixed(2);
      array = array.concat(data1);
      setTodos((todos) => [...todos, { $flag: FLAG.NEW, data: data1 }]);

      const data2 = Math.random().toFixed(2);
      array = array.concat(data2);
      setTodos((todos) => [...todos, { $flag: FLAG.NEW, data: data2 }]);

      const data3 = Math.random().toFixed(2);
      array = array.concat(data3);
      setTodos((todos) => [...todos, { $flag: FLAG.NEW, data: data3 }]);

      const data4 = Math.random().toFixed(2);
      array = array.concat(data4);
      setTodos((todos) => [...todos, { $flag: FLAG.NEW, data: data4 }]);

      expect(todos().map((t) => t.data)).toEqual(array);
    });
  });
});

describe("batch test", () => {
  test("test 1", () => {
    reactive.createRoot(() => {
      const [name, setName] = reactive.createSignal<string>();
      const [result, setResult] = reactive.createSignal<string | undefined>(
        name()
      );
      let count = 0;

      reactive.createEffect(() => {
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

describe("nest test", () => {
  test("test 1", () => {
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

  test("test 2", () => {
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
