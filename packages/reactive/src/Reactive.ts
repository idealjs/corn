export const IS_REACTIVE_READ = "IS_REACTIVE_READ";
export const REACTIVE_EFFECTS = "REACTIVE_EFFECTS";

export type ReadFunction<T = unknown> = () => T;
export type WriteFunction<T = unknown> = (
  next: T | ((preValue: T) => T)
) => void;
export interface IEffect<T = unknown> {
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
  private root: IRoot = {
    effects: [],
    batch: {
      pending: false,
      effects: new Set(),
    },
  };

  constructor() {
    this.createSignal = this.createSignal.bind(this);
    this.useMemo = this.useMemo.bind(this);
    this.useEffect = this.useEffect.bind(this);
  }
  private static handler = (effects: Map<Function, IEffect>, root: IRoot) => ({
    get(target: object, p: string | symbol, receiver: unknown) {
      const effect = root.effects[root.effects.length - 1];

      if (effect != null) {
        effects.set(effect.fn, effect);
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

      effects.forEach((effect) => {
        root.effects.push(effect);
        if (root.batch.pending) {
          root.batch.effects.add(effect);
        } else {
          effect.prev = effect.fn(effect.prev);
        }
        root.effects.pop();
      });

      return true;
    },
  });

  public createSignal<T>(): [
    ReadFunction<T | undefined>,
    WriteFunction<T | undefined>
  ];

  public createSignal<T>(value: T): [ReadFunction<T>, WriteFunction<T>];

  public createSignal<T>(
    value?: T
  ): [ReadFunction<typeof value>, WriteFunction<typeof value>] {
    let tmp: T | undefined = value;

    const root = this.root;
    const effects = new Map<Function, IEffect>();
    const proxy = new Proxy<{ value: typeof value }>(
      { value },
      Reactive.handler(effects, root)
    );

    const read: ReadFunction<typeof value> = () => {
      return proxy.value;
    };

    Reflect.defineProperty(read, IS_REACTIVE_READ, { value: true });
    Reflect.defineProperty(read, REACTIVE_EFFECTS, { value: effects });

    const write: WriteFunction<typeof value> = (nextValue) => {
      if (isSetFunction(nextValue)) {
        proxy.value = tmp = nextValue(tmp);
      } else {
        proxy.value = tmp = nextValue;
      }
    };
    return [read, write];
  }

  public useMemo<T>(fn: (prev?: T) => T) {
    const [state, setState] = this.createSignal<T>();
    this.useEffect<T>((prev) => {
      const value = fn(prev);
      if (value !== prev) {
        setState(value);
      }
      return value;
    });
    return state;
  }

  public useEffect = <T>(fn: (prev?: T) => T) => {
    const root = this.root;
    const effect: IEffect<T> = {
      fn,
    };
    root.effects.push(effect);
    effect.prev = fn(effect.prev);
    root.effects.pop();
    return effect.prev;
  };

  public batch = (fn: () => void) => {
    const root = this.root;
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
