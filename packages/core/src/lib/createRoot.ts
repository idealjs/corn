import DomRoot from "./DomRoot";

const createRoot = (container?: Element | null) => {
  if (container != null) {
    return new DomRoot(container);
  }
};

export default createRoot;
