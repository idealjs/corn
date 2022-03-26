interface IWorker<T, R = unknown> {
  work: (t: T) => Promise<R> | (() => Promise<R>);
}

class Scheduler<T, R = unknown> {
  private cache: Array<T> = [];
  private working: boolean = false;
  private pending: number = 0;
  private worker: IWorker<T, R>;
  constructor(worker: IWorker<T, R>, values?: readonly T[] | null) {
    this.worker = worker;
  }

  public add(value: T) {
    this.pending++;
    this.cache.push(value);
    if (!this.working) {
      this.work();
    }
  }

  private async work() {
    this.working = true;
    for (const value of this.cache) {
      await this.halt();
      await this.worker.work(value);
      this.cache.shift();
    }
    this.working = false;
  }

  private halt() {
    return new Promise<void>((resolve) => {
      let pending = this.pending;
      if (this.pending !== 0) {
        setTimeout(async () => {
          if (pending === this.pending) {
            pending = 0;
            resolve();
          } else {
            pending = this.pending;
            await this.halt();
            return;
          }
        }, 16);
      } else {
        resolve();
      }
    });
  }
}

export default Scheduler;
