import { CORN_ELEMENT_KEY } from "../src/lib/CornElement";
import reconcile, { FLAG, RECONCILE_FLAG } from "../src/lib/reconcile";

describe("reconcile", () => {
  test("even index keep", () => {
    const seed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s, index) => {
      const v = { a: s, index };
      return v;
    });

    const prev = seed.map((s) => {
      Reflect.defineProperty(s, CORN_ELEMENT_KEY, {
        value: s.index,
      });
      Reflect.defineProperty(s, RECONCILE_FLAG, {
        value: FLAG.USING,
        writable: true,
      });
      return s;
    });

    const next = [prev[1], prev[3], prev[5], prev[7], prev[9]];

    const res = reconcile(prev, next);

    // console.log(
    //   "test test",
    //   next.length,
    //   res.map((r) => {
    //     return {
    //       ...r,
    //       [CORN_ELEMENT_KEY]: Reflect.getOwnPropertyDescriptor(
    //         r,
    //         CORN_ELEMENT_KEY
    //       )?.value,
    //       [RECONCILE_FLAG]: Reflect.getOwnPropertyDescriptor(r, RECONCILE_FLAG)
    //         ?.value,
    //     };
    //   })
    // );

    expect(res.length).toBe(10);

    expect(
      Reflect.getOwnPropertyDescriptor(res[0], RECONCILE_FLAG)?.value
    ).toBe(FLAG.REMOVING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[2], RECONCILE_FLAG)?.value
    ).toBe(FLAG.REMOVING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[4], RECONCILE_FLAG)?.value
    ).toBe(FLAG.REMOVING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[6], RECONCILE_FLAG)?.value
    ).toBe(FLAG.REMOVING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[8], RECONCILE_FLAG)?.value
    ).toBe(FLAG.REMOVING);

    expect(
      Reflect.getOwnPropertyDescriptor(res[1], RECONCILE_FLAG)?.value
    ).toBe(FLAG.USING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[3], RECONCILE_FLAG)?.value
    ).toBe(FLAG.USING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[5], RECONCILE_FLAG)?.value
    ).toBe(FLAG.USING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[7], RECONCILE_FLAG)?.value
    ).toBe(FLAG.USING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[9], RECONCILE_FLAG)?.value
    ).toBe(FLAG.USING);
  });

  test("middle index keep", () => {
    const seed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s, index) => {
      const v = { a: s, index };
      return v;
    });

    const prev = seed.map((s) => {
      Reflect.defineProperty(s, CORN_ELEMENT_KEY, {
        value: s.index,
      });
      Reflect.defineProperty(s, RECONCILE_FLAG, {
        value: FLAG.USING,
        writable: true,
      });
      return s;
    });

    const next = [prev[3], prev[4], prev[5], prev[6], prev[7]];

    const res = reconcile(prev, next);

    expect(res.length).toBe(10);

    expect(
      Reflect.getOwnPropertyDescriptor(res[0], RECONCILE_FLAG)?.value
    ).toBe(FLAG.REMOVING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[1], RECONCILE_FLAG)?.value
    ).toBe(FLAG.REMOVING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[2], RECONCILE_FLAG)?.value
    ).toBe(FLAG.REMOVING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[8], RECONCILE_FLAG)?.value
    ).toBe(FLAG.REMOVING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[9], RECONCILE_FLAG)?.value
    ).toBe(FLAG.REMOVING);

    expect(
      Reflect.getOwnPropertyDescriptor(res[3], RECONCILE_FLAG)?.value
    ).toBe(FLAG.USING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[4], RECONCILE_FLAG)?.value
    ).toBe(FLAG.USING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[5], RECONCILE_FLAG)?.value
    ).toBe(FLAG.USING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[6], RECONCILE_FLAG)?.value
    ).toBe(FLAG.USING);
    expect(
      Reflect.getOwnPropertyDescriptor(res[7], RECONCILE_FLAG)?.value
    ).toBe(FLAG.USING);
  });
});
