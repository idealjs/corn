import Scheduler from "../src/Scheduler";
import timer from "./timer";

const scheduler = new Scheduler<() => void, number>({
  work: async (t) => {
    t();
    return 0;
  },
});

beforeEach(() => {
  jest.useFakeTimers();
});

describe("scheduler", () => {
  test("scheduler", (done) => {
    const callback = jest.fn();
    scheduler.add(callback);
    jest.advanceTimersByTime(16);
    timer(16)
      .then(() => {
        expect(callback).toBeCalled();
        done();
      })
      .catch((err) => {
        done(err);
      });
    jest.advanceTimersByTime(16);
  });
});
