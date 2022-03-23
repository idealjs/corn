import {
  classModule,
  eventListenersModule,
  init,
  propsModule,
  styleModule,
} from "snabbdom";

import CornElement from "./CornElement";
import { createRoot } from "./reactive";

export const patch = init(
  [classModule, propsModule, styleModule, eventListenersModule],
  undefined,
  {
    experimental: {
      fragments: true,
    },
  }
);

const render = (cornElement: CornElement, container: Element) => {
  createRoot(() => {
    const vNode = cornElement.create();
    patch(container, vNode);
  });
};

export default render;
