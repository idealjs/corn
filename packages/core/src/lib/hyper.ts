import CornElement, { Props } from "./CornElement";

const hyper = (
  type: string | ((props: Props) => CornElement),
  props: Props
): CornElement => {
  return new CornElement(type, props);
};

export default hyper;
