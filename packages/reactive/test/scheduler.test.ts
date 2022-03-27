import Scheduler from "../src/Scheduler";
import waitUntil from "./waitUntil";

let scheduler: Scheduler<() => void, void>;

beforeEach(() => {
  scheduler = new Scheduler<() => void, void>({
    work: async (t) => {
      t();
    },
  });
  jest.spyOn(global, "setTimeout");
});

describe("scheduler", () => {
  test("scheduler", async () => {
    const callback = jest.fn();
    scheduler.add(callback);
    await waitUntil(() => {
      return !scheduler.working;
    });
    expect(callback).toBeCalledTimes(1);
    expect(setTimeout).toBeCalledTimes(1);
  });

  test("scheduler add twice", async () => {
    const callback = jest.fn();
    scheduler.add(callback);
    scheduler.add(callback);

    await waitUntil(() => {
      return !scheduler.working;
    });

    expect(setTimeout).toBeCalledTimes(3);
    expect(callback).toBeCalledTimes(1);
  });
});
