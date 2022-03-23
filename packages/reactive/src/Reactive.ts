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

interface ISignal<T = unknown> {
  read: ReadFunction<T>;
  write: WriteFunction<T>;
  effects: Set<IEffect<T>>;
}

interface IRoot {
  effects: IEffect<any>[];
  signals: ISignal<any>[];
  batch: {
    pending: boolean;
    effects: Set<IEffect>;
  };
}

const isSetFunction = <T>(v: T | ((d: T) => T)): v is (d: T) => T => {
  return v instanceof Function;
};

const cleanEffects = (signals: ISignal[]) => {
  signals.forEach((signal) => {
    signal.effects.clear();
  });
};

//Publish–subscribe pattern
class Reactive {
  private roots: IRoot[] = [];

  constructor() {
    this.createRoot = this.createRoot.bind(this);
    this.createSignal = this.createSignal.bind(this);
    this.useMemo = this.useMemo.bind(this);
    this.useEffect = this.useEffect.bind(this);
    this.handler = this.handler.bind(this);
  }

  private handler(signalEffects: Set<IEffect>, root?: IRoot) {
    const getRoots = () => {
      return root ? [root] : this.roots;
    };
    return {
      get(target: object, p: string | symbol, receiver: unknown) {
        const roots = getRoots();
        const effects = roots
          .map((root) => root.effects[root.effects.length - 1])
          .filter((effect) => effect != null);
        const effect = effects[0] as IEffect | undefined;

        if (effect != null) {
          signalEffects.add(effect);
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

        // const roots = getRoots();

        signalEffects.forEach((effect) => {
          effect.prev = effect.fn(effect.prev);
          // push effect, wait signal's read re collect
          // roots.forEach((root) => {
          //   root.effects.push(effect);
          //   if (root.batch.pending) {
          //     root.batch.effects.add(effect);
          //   } else {

          //   }
          //   root.effects.pop();
          // });
        });

        // debugger;
        return true;
      },
    };
  }

  public createRoot<T>(fn: (dispose: () => void) => T): T {
    const root: IRoot = {
      effects: [],
      signals: [],
      batch: {
        pending: false,
        effects: new Set<IEffect>(),
      },
    };
    this.roots.push(root);
    const res = fn(() => cleanEffects(root.signals));
    this.roots.pop();
    return res;
  }

  public createSignal<V>(): [
    ReadFunction<V | undefined>,
    WriteFunction<V | undefined>
  ];

  public createSignal<V>(value: V): [ReadFunction<V>, WriteFunction<V>];

  public createSignal<V>(
    value?: V
  ): [ReadFunction<V | undefined>, WriteFunction<V | undefined>] {
    let tmp: V | undefined = value;

    const root = this.roots[this.roots.length - 1] as IRoot | undefined;
    const effects = new Set<IEffect>();
    const proxy = new Proxy<{ value: V | undefined }>(
      { value },
      this.handler(effects, root)
    );

    const read: ReadFunction<V | undefined> = () => {
      return proxy.value;
    };

    Reflect.defineProperty(read, IS_REACTIVE_READ, { value: true });

    const write: WriteFunction<V | undefined> = (nextValue) => {
      if (isSetFunction(nextValue)) {
        proxy.value = tmp = nextValue(tmp);
      } else {
        proxy.value = tmp = nextValue;
      }
    };

    root?.signals.push({
      read,
      write: write,
      effects,
    });
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

  // create effect wait signal read function collect;
  public useEffect = <T>(fn: (prev?: T) => T) => {
    const root = this.roots[this.roots.length - 1] as IRoot | undefined;
    const effect: IEffect<T> = {
      fn,
    };
    root?.effects.push(effect);
    effect.prev = fn(effect.prev);
    root?.effects.pop();
    return effect.prev;
  };

  public batch = (fn: () => void) => {
    const root = this.roots[this.roots.length - 1] as IRoot | undefined;
    root && (root.batch.pending = true);
    fn();
    root && (root.batch.pending ??= false);
    root?.batch.effects.forEach((effect) => {
      effect.prev = effect.fn(effect.prev);
    });
    root?.batch.effects.clear();
  };
}

export default Reactive;
