import { useMemo } from "@idealjs/corn";

import { data } from "./Parent";

interface IProps {
  datumId: string;
}

const Child = (props: IProps) => {
  const { datumId } = props;
  
  const name = useMemo(() => {
    return data().find((d) => d.id === datumId)?.name;
  });

  return <div>Child {name}</div>;
};

export default Child;
