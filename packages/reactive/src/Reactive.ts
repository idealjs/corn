import reconcile from "./reconcile";
import { Compare, ExtractArray, FLAG, WithFlag } from "./type";

export type ReadFunction<T = unknown> = () => T;
export type WriteFunction<T = unknown> = (
  next: T | ((preValue: T) => T)
) => void;
interface IEffect<T = unknown> {
  fn: (prev: T) => T;
  prev?: T;
}
interface IRoot {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  effects: IEffect<any>[];
  batch: {
    pending: boolean;
    effects: Set<IEffect>;
  };
}

const isSetFunction = <T>(v: T | ((d: T) => T)): v is (d: T) => T => {
  return v instanceof Function;
};

//Publish–subscribe pattern
class Reactive {
  private roots: IRoot[] = [];
  constructor() {
    this.createRoot = this.createRoot.bind(this);
    this.createSignal = this.createSignal.bind(this);
    this.createDiffSignal = this.createDiffSignal.bind(this);
    this.createMemo = this.createMemo.bind(this);
    this.createEffect = this.createEffect.bind(this);
  }
  private static handler = (effects: Set<IEffect>, root: IRoot) => ({
    get(target: object, p: string | symbol, receiver: unknown) {
      const effect = root.effects[root.effects.length - 1];
      if (effect != null) {
        effects.add(effect);
      }
      return Reflect.get(target, p, receiver);
    },
    set: (
      target: object,
      p: string | symbol,
      value: unknown,
      receiver: unknown
    ) => {
      Reflect.set(target, p, value, receiver);
      for (const effect of [...effects]) {
        root.effects.push(effect);
        if (root.batch.pending) {
          root.batch.effects.add(effect);
        } else {
          effect.prev = effect.fn(effect.prev);
        }
        root.effects.pop();
      }
      return true;
    },
  });

  private static diffHandler = <T>(
    effects: Set<IEffect>,
    root: IRoot,
    compare: Compare<WithFlag<T>>
  ) => {
    return {
      get(
        target: { value: WithFlag<T>[] | undefined },
        p: string | symbol,
        receiver: unknown
      ): WithFlag<T>[] | undefined {
        const effect = root.effects[root.effects.length - 1];
        if (effect != null) {
          effects.add(effect);
        }
        return Reflect.get(target, p, receiver);
      },
      set: (
        target: { value: WithFlag<T>[] },
        p: string | symbol,
        value: WithFlag<T>[],
        receiver: unknown
      ) => {
        const prev: WithFlag<T>[] = (
          Reflect.get(target, p, receiver) as WithFlag<T>[]
        )
          .filter((p) => p.$flag !== FLAG.REMOVED)
          .map((p) => ({ ...p, $flag: FLAG.NORMAL }));

        const next = reconcile(prev, value, compare);

        Reflect.set(target, p, next, receiver);
        for (const effect of [...effects]) {
          root.effects.push(effect);
          if (root.batch.pending) {
            root.batch.effects.add(effect);
          } else {
            effect.prev = effect.fn(effect.prev);
          }
          root.effects.pop();
        }
        return true;
      },
    };
  };

  public createRoot = <T>(fn: () => T): T => {
    const root: IRoot = {
      effects: [],
      batch: {
        pending: false,
        effects: new Set<IEffect>(),
      },
    };
    this.roots.push(root);
    const res = fn();
    this.roots.pop();
    return res;
  };

  public createSignal<T>(): [
    ReadFunction<T | undefined>,
    WriteFunction<T | undefined>
  ];

  public createSignal<T>(value: T): [ReadFunction<T>, WriteFunction<T>];

  public createSignal<T>(
    value?: T
  ): [ReadFunction<typeof value>, WriteFunction<typeof value>] {
    let tmp: T | undefined = value;

    const root = this.roots[this.roots.length - 1];
    const effects = new Set<IEffect>();
    const proxy = new Proxy<{ value: typeof value }>(
      { value },
      Reactive.handler(effects, root)
    );

    const read: ReadFunction<typeof value> = () => {
      return proxy.value;
    };

    const write: WriteFunction<typeof value> = (nextValue) => {
      if (isSetFunction(nextValue)) {
        proxy.value = tmp = nextValue(tmp);
      } else {
        proxy.value = tmp = nextValue;
      }
    };
    return [read, write];
  }

  public createDiffSignal<
    TA extends WithFlag<unknown>[],
    T = ExtractArray<TA>
  >(): [
    ReadFunction<WithFlag<T>[] | undefined>,
    WriteFunction<WithFlag<T>[] | undefined>
  ];

  public createDiffSignal<TA extends WithFlag<unknown>[]>(
    value: TA
  ): [ReadFunction<typeof value>, WriteFunction<typeof value>];

  public createDiffSignal<TA extends WithFlag<unknown>[], T = ExtractArray<TA>>(
    value?: WithFlag<T>[] | undefined,
    compare: Compare<WithFlag<T>> = (p, n) => p.data === n.data
  ): [
    ReadFunction<WithFlag<T>[] | undefined>,
    WriteFunction<WithFlag<T>[] | undefined>
  ] {
    let tmp: WithFlag<T>[] | undefined = value;

    const root = this.roots[this.roots.length - 1];
    const effects = new Set<IEffect>();

    const proxy = new Proxy<{ value: WithFlag<T>[] | undefined }>(
      { value },
      Reactive.diffHandler(effects, root, compare)
    );

    const read: ReadFunction<WithFlag<T>[] | undefined> = () => {
      return proxy.value;
    };

    const write: WriteFunction<WithFlag<T>[] | undefined> = (nextValue) => {
      if (isSetFunction(nextValue)) {
        proxy.value = tmp = nextValue(
          tmp?.map((v) => ({ ...v, $flag: FLAG.NORMAL }))
        );
      } else {
        proxy.value = tmp = nextValue;
      }
    };
    return [read, write];
  }

  public createMemo<T>(fn: (prev?: T) => T) {
    const [state, setState] = this.createSignal<T>();
    this.createEffect<T>((prev) => {
      const value = fn(prev);
      if (value !== prev) {
        setState(value);
      }
      return value;
    });
    return state;
  }

  public createEffect = <T>(fn: (prev?: T) => T) => {
    const root = this.roots[this.roots.length - 1];
    const effect: IEffect<T> = {
      fn,
    };
    root.effects.push(effect);
    effect.prev = fn(effect.prev);
    root.effects.pop();
    return effect.prev;
  };

  public batch = (fn: () => void) => {
    const root = this.roots[this.roots.length - 1];
    root.batch.pending = true;
    fn();
    root.batch.pending = false;
    root.batch.effects.forEach((effect) => {
      effect.prev = effect.fn(effect.prev);
    });
    root.batch.effects.clear();
  };
}

export default Reactive;
