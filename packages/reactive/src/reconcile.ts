import { Compare, FLAG, WithFlag } from "./type";

const reconcile = <T>(
  p: WithFlag<T>[],
  n: WithFlag<T>[],
  compare: Compare<WithFlag<T>>
): WithFlag<T>[] => {
  // O(m*n)
  const nEnd = n.length;
  let nStart = 0;

  let tmp: WithFlag<T>[] = [];

  loop1: for (let pIndex = 0; pIndex < p.length; pIndex++) {
    for (let nIndex = nStart; nIndex < n.length; nIndex++) {
      if (compare(p[pIndex], n[nIndex])) {
        //found in next,set flat to normal
        tmp = tmp
          .concat(n.slice(nStart, nIndex))
          .concat(p.slice(pIndex, pIndex + 1));

        nStart = nIndex + 1;

        continue loop1;
      } else if (nIndex === nEnd - 1) {
        //not found in next,set flag to remove
        tmp = tmp.concat({ ...p[pIndex], $flag: FLAG.REMOVED });
      }
    }
    if (nStart >= n.length) {
      //not item in n;
      tmp = tmp.concat({ ...p[pIndex], $flag: FLAG.REMOVED });
    }
  }
  if (nStart <= n.length) {
    //not item in p;
    tmp = tmp.concat(n.slice(nStart, n.length));
  }

  return tmp;
};

export default reconcile;
