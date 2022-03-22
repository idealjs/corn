import {
  classModule,
  eventListenersModule,
  init,
  propsModule,
  styleModule,
} from "snabbdom";

import CornElement, { RELEASE_EFFECT_FN } from "./CornElement";

export const patch = init(
  [
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    {
      update: (vNode) => {
        console.log(
          "test test update",
          Reflect.getOwnPropertyDescriptor(vNode, RELEASE_EFFECT_FN)?.value
        );
        Reflect.getOwnPropertyDescriptor(vNode, RELEASE_EFFECT_FN)?.value?.();
      },
      remove: (vNode) => {
        console.log(
          "test test remove",
          Reflect.getOwnPropertyDescriptor(vNode, RELEASE_EFFECT_FN)?.value
        );
      },
    },
  ],
  undefined,
  {
    experimental: {
      fragments: true,
    },
  }
);

const render = (cornElement: CornElement, container: Element) => {
  const vNode = cornElement.create();
  patch(container, vNode);
};

export default render;
