import { IS_REACTIVE_READ, ReadFunction } from "@idealjs/corn-reactive";
import { fragment, h, VNode } from "snabbdom";

import { useEffect } from "./reactive";
import { patch } from "./render";

export type Primitive = number | string | boolean | symbol | null | undefined;
export type CornText = number | string | boolean;
export type CornComponent<P = unknown> = (props?: P) => CornElement;

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
  children?: Child[];
}

const handleChildren = (children: Child[]): VNode[] => {
  return children
    ?.map((child) => {
      if (isCornText(child)) {
        return child.toString();
      }
      if (child instanceof CornElement) {
        return child.create();
      }
      if (child instanceof Function) {
        if (Reflect.getOwnPropertyDescriptor(child, IS_REACTIVE_READ)?.value) {
          return useEffect<VNode | undefined>((prev) => {
            const res = child();

            if (isCornText(res)) {
              if (prev == null) {
                const vNode = fragment([res.toString()]);
                return vNode;
              } else {
                const vNode = fragment([res.toString()]);
                return patch(prev, vNode);
              }
            }
          });
        }
      }
      // if (child instanceof Array) {
      //   return handleChildren(child);
      // }
      console.warn("[warn] skip create", child, typeof child);
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

  public create(): VNode {
    if (this.type instanceof Function) {
      const cornElement = this.type(this.props);
      return cornElement.create();
    }

    const children = handleChildren(this.props.children ?? []);
    const vNode = h(
      this.type,
      { ...this.props, on: { click: this.props.onClick } },
      children
    );
    console.log(vNode);
    return vNode;
  }
}

export default CornElement;
