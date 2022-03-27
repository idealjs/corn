interface IWorker<T, R = unknown> {
  work: (t: T) => Promise<R> | (() => Promise<R>);
}

class Scheduler<T, R = unknown> {
  private cache: Set<T> = new Set<T>();
  private _working: boolean = false;
  private pending: number = 0;
  private worker: IWorker<T, R>;
  constructor(worker: IWorker<T, R>, values?: readonly T[] | null) {
    this.worker = worker;
  }

  public async add(value: T) {
    this.pending++;
    this.cache.add(value);
    if (!this.working) {
      await this.work();
    }
  }

  private async work() {
    this._working = true;
    for (const value of this.cache) {
      await this.halt();
      await this.worker.work(value);
      this.cache.delete(value);
    }
    this._working = false;
  }

  private halt() {
    return new Promise<void>((resolve) => {
      let pending = this.pending;
      if (this.pending !== 0) {
        setTimeout(async () => {
          if (pending === this.pending) {
            this.pending = 0;
            resolve();
          } else {
            await this.halt();
            this.pending = 0;
            resolve();
          }
        }, 16);
      } else {
        resolve();
      }
    });
  }

  public get working() {
    return this._working;
  }
}

export default Scheduler;
