import { IS_REACTIVE_READ, ReadFunction } from "@idealjs/corn-reactive";

import { useEffect } from "./reactive";

export type Primitive = number | string | boolean | symbol | null | undefined;
export type CornText = number | string | boolean;
export type CornComponent<P = unknown> = (props?: P) => CornElement;

export const isCornText = (d: unknown): d is CornText => {
  return (
    typeof d === "number" || typeof d === "string" || typeof d === "boolean"
  );
};

interface IEvents {
  onClick?: () => void;
}

type Child = Primitive | CornElement | ReadFunction | Child[];

export const CORN_ELEMENT_KEY = "CORN_ELEMENT_KEY";

export interface Props extends IEvents {
  children?: Child[];
}

const handleChildren = (parent: Element, children: Child[]) => {
  children?.forEach((child) => {
    if (isCornText(child)) {
      parent.append(document.createTextNode(child.toString()));
    }
    if (child instanceof CornElement) {
      parent.append(child.create());
    }
    if (child instanceof Function) {
      if (Reflect.getOwnPropertyDescriptor(child, IS_REACTIVE_READ)?.value) {
        useEffect<Text | Element | Element[] | undefined>((prev) => {
          const res = child();
          if (isCornText(res)) {
            if (prev == null) {
              const text = document.createTextNode(res.toString());
              parent.append(text);
              return text;
            }
            if (!(prev instanceof Array)) {
              prev.nodeValue = res.toString();
            }
            return prev;
          }
          if (res instanceof Array && prev instanceof Array) {
          }
        });
      }
    }
    if (child instanceof Array) {
      handleChildren(parent, child);
    }
    console.warn("[warn] skip create", child, typeof child);
    return null;
  });
};

class CornElement {
  private type: string | ((props: Props) => CornElement);
  private props: Props;
  constructor(type: string | ((props: Props) => CornElement), props: Props) {
    this.type = type;
    this.props = props;
  }

  public create(): HTMLElement {
    if (this.type instanceof Function) {
      const cornElement = this.type(this.props);
      return cornElement.create();
    }
    const element = document.createElement(this.type);

    if (this.props.children) {
      handleChildren(element, this.props.children);
    }

    if (this.props.onClick) {
      Reflect.set(element, "onclick", this.props.onClick);
    }

    return element;
  }
}

export default CornElement;
