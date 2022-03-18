import { CORN_ELEMENT_KEY } from "./CornElement";

export const RECONCILE_FLAG = "$reconcile_flag";

export enum FLAG {
  USING = "USING",
  REMOVING = "REMOVING",
  ADDING = "ADDING",
}

const compare = <P extends {} = {}, N extends {} = []>(p: P, n: N) => {
  return (
    Reflect.getOwnPropertyDescriptor(p, CORN_ELEMENT_KEY)?.value ===
    Reflect.getOwnPropertyDescriptor(n, CORN_ELEMENT_KEY)?.value
  );
};

const reconcile = <P extends {} = {}, N extends {} = {}>(
  p: P[],
  n: N[]
): (P | N)[] => {
  // O(m*n)
  const nEnd = n.length;
  let nStart = 0;

  let tmp: (P | N)[] = [];
  loop1: for (let pIndex = 0; pIndex < p.length; pIndex++) {
    for (let nIndex = nStart; nIndex < n.length; nIndex++) {
      if (compare(p[pIndex], n[nIndex])) {
        //found in next,set flat to using
        tmp = tmp.concat(
          n.slice(nStart, nIndex).map((v) => {
            const succ = Reflect.defineProperty(v, RECONCILE_FLAG, {
              value: FLAG.ADDING,
              writable: true,
            });
            if (!succ) {
              throw new Error("define RECONCILE_FLAG faild");
            }
            return v;
          })
        );

        tmp = tmp.concat(
          p.slice(pIndex, pIndex + 1).map((v) => {
            const succ = Reflect.defineProperty(v, RECONCILE_FLAG, {
              value: FLAG.USING,
              writable: true,
            });
            if (!succ) {
              throw new Error("define RECONCILE_FLAG faild");
            }
            return v;
          })
        );

        nStart = nIndex + 1;

        continue loop1;
      } else if (nIndex === nEnd - 1) {
        //not found in next,set flag to remove
        const succ = Reflect.defineProperty(p[pIndex], RECONCILE_FLAG, {
          value: FLAG.REMOVING,
          writable: true,
        });
        if (!succ) {
          throw new Error("define RECONCILE_FLAG faild");
        }
        tmp = tmp.concat(p[pIndex]);
      }
    }
    if (nStart >= n.length) {
      //not item in n;
      const succ = Reflect.defineProperty(p[pIndex], RECONCILE_FLAG, {
        value: FLAG.REMOVING,
        writable: true,
      });
      if (!succ) {
        throw new Error("define RECONCILE_FLAG faild");
      }
      tmp = tmp.concat(p[pIndex]);
      continue;
    }
  }
  if (nStart <= n.length) {
    //not item in p;
    tmp = tmp.concat(
      n.slice(nStart, n.length).map((v) => {
        const succ = Reflect.defineProperty(v, RECONCILE_FLAG, {
          value: FLAG.ADDING,
          writable: true,
        });
        if (!succ) {
          throw new Error("define RECONCILE_FLAG faild");
        }
        return v;
      })
    );
  }

  return tmp;
};

export default reconcile;
