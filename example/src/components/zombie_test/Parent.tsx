import { createSignal, useMemo } from "@idealjs/corn";

import Child from "./Child";

const [data, setData] = createSignal([
  { id: "1", name: "1" },
  { id: "2", name: "2" },
  { id: "3", name: "3" },
]);

export { data, setData };

const Parent = () => {
  const mockChildren = useMemo(() => {
    return data().map((d) => <Child datumId={d.id} />);
  });
  return (
    <div>
      {mockChildren}
      <button
        onClick={() => {
          setData((d) => {
            d.pop();
            return d;
          });
        }}
      >
        -
      </button>
    </div>
  );
};

export default Parent;
