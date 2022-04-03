import { IS_REACTIVE_READ, ReadFunction } from "@idealjs/corn-reactive";
import { h, Key, VNode } from "snabbdom";

import { createRoot, useEffect } from "./reactive";
import { patch } from "./render";

export type Primitive = number | string | boolean | symbol | null | undefined;
export type CornText = number | string | boolean;
export type CornComponent<P = unknown> = (props?: P) => CornElement;
export const RELEASE_EFFECT_FN = "RELEASE_EFFECT_FN";
export const isCornText = (d: unknown): d is CornText => {
  return (
    typeof d === "number" || typeof d === "string" || typeof d === "boolean"
  );
};

interface IEvents {
  onClick: () => void;
}

type Child = Primitive | CornElement | ReadFunction | Child[];

export const CORN_ELEMENT_KEY = "CORN_ELEMENT_KEY";

export interface Props extends IEvents {
  children?: Child | Child[];
  key?: Key;
}

const handleChildren = (children: Child[]): VNode[] => {
  return children
    ?.flatMap((child) => {
      if (isCornText(child)) {
        return child.toString();
      }
      if (child instanceof CornElement) {
        return child.create();
      }
      if (child instanceof Function) {
        if (Reflect.getOwnPropertyDescriptor(child, IS_REACTIVE_READ)?.value) {
          const handleChildEffectFn = (prev?: VNode) => {
            const res = child();
            console.debug("[debug] effectFn res", res, prev);
            if (isCornText(res)) {
              if (prev == null) {
                const vNode = h("div", [res.toString()]);
                return vNode;
              } else {
                const vNode = h("div", [res.toString()]);
                return patch(prev, vNode);
              }
            }
            if (res instanceof Array) {
              if (prev == null) {
                const resChildren = handleChildren(res);
                const vNode = h("div", resChildren);
                return vNode;
              } else {
                const resChildren = handleChildren(res);
                const vNode = h("div", resChildren);
                return patch(prev, vNode);
              }
            }
            console.warn("[warn] skip create res", res, typeof res);
          };
          return useEffect<VNode | undefined>(handleChildEffectFn);
        }
      }
      if (child instanceof Array) {
        return handleChildren(child);
      }
      console.warn("[warn] skip create child", child, typeof child);
      return null;
    })
    .filter((v): v is VNode => v != null);
};

class CornElement {
  private type: string | ((props: Props) => CornElement);
  private props: Props;
  constructor(type: string | ((props: Props) => CornElement), props: Props) {
    this.type = type;
    this.props = props;
  }

  public create(withRoot: boolean = true): VNode {
    const effectFn = (prev?: VNode) => {
      if (this.type instanceof Function) {
        if (prev != null) {
          return prev;
        }
        const cornElement = this.type(this.props);
        const vNode = cornElement.create(false);

        return vNode;
      }

      const children = handleChildren([this.props.children].flatMap((c) => c));

      const vNode = h(
        this.type,
        { ...this.props, on: { click: this.props.onClick } },
        children
      );

      return vNode;
    };
    if (withRoot) {
      return createRoot(() => {
        return useEffect(effectFn);
      });
    } else {
      return useEffect(effectFn);
    }
  }
}

export default CornElement;
