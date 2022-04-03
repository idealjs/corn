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

const handleChildren = (children: Child[], clean?: () => void): VNode[] => {
  return children
    ?.flatMap((child) => {
      if (isCornText(child)) {
        return child.toString();
      }
      if (child instanceof CornElement) {
        return child.create(true, clean);
      }
      if (child instanceof Function) {
        if (Reflect.getOwnPropertyDescriptor(child, IS_REACTIVE_READ)?.value) {
          return useEffect(() => {
            const res = child();
            console.debug("[debug] effectFn res", res);
            if (isCornText(res)) {
              const vNode = h("div", [res.toString()]);
              return vNode;
            }
            if (res instanceof Array) {
              const resChildren = handleChildren(res, clean);
              const vNode = h("div", resChildren);
              return vNode;
            }
            console.warn("[warn] skip create res", res, typeof res);
          });
        }
      }
      if (child instanceof Array) {
        return handleChildren(child, clean);
      }
      console.warn("[warn] skip create child", child, typeof child);
      return null;
    })
    .filter((v): v is VNode => v != null);
};

class CornElement {
  private type: string | ((props: Props) => CornElement);
  private props: Props;
  private clean?: () => void;
  constructor(type: string | ((props: Props) => CornElement), props: Props) {
    this.type = type;
    this.props = props;
    this.create = this.create.bind(this);
  }

  public create(withRoot: boolean = true, clean?: () => void): VNode {
    const effectFn = (prev?: VNode) => {
      if (this.type instanceof Function) {
        if (prev != null) {
          return prev;
        }
        const cornElement = this.type(this.props);
        const vNode = cornElement.create(false, this.clean || clean);

        return vNode;
      }

      const children = handleChildren(
        [this.props.children].flatMap((c) => c),
        this.clean || clean
      );

      const vNode = h(
        this.type,
        { ...this.props, on: { click: this.props.onClick } },
        children
      );
      if (prev) {
        return patch(prev, vNode);
      } else {
        return vNode;
      }
    };
    if (withRoot) {
      clean && clean();
      return createRoot((dispose) => {
        this.clean = dispose;
        return useEffect(effectFn);
      });
    } else {
      return useEffect(effectFn);
    }
  }
}

export default CornElement;
