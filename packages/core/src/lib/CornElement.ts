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

export interface Props extends IEvents {
  children?: Array<Primitive | CornElement | ReadFunction>;
}

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

    this.props.children?.forEach(
      (child: Primitive | CornElement | ReadFunction) => {
        if (isCornText(child)) {
          element.append(document.createTextNode(child.toString()));
        }
        if (child instanceof CornElement) {
          element.append(child.create());
        }
        if (child instanceof Function) {
          if (Reflect.getOwnPropertyDescriptor(child, IS_REACTIVE_READ)) {
            useEffect<Text | undefined>((prev) => {
              const res = child();
              if (isCornText(res)) {
                if (prev == null) {
                  const text = document.createTextNode(res.toString());
                  element.append(text);
                  return text;
                }
                prev.nodeValue = res.toString();
                return prev;
              }
            });
          }
        }
        console.warn("[warn] skip create", child, typeof child);
        return null;
      }
    );

    if (this.props.onClick) {
      Reflect.set(element, "onclick", this.props.onClick);
    }

    return element;
  }

  upsert(
    parent: Element,
    value: Node[] | Node | string | null,
    current: Node[] | Node | string | null
  ) {
    console.debug("[debug] upsert", parent, value, current);
    if (value === current) {
      return value;
    }

    if (value == null) {
      parent.textContent = "";
      return value;
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      parent.textContent = value.toString();
      return value;
    }

    if (value instanceof Node) {
      if (current instanceof Node) {
        parent.replaceChild(value, current);
        return value;
      }
      parent.textContent = "";
      parent.append(value);
      return value;
    }

    if (Array.isArray(value)) {
      parent.textContent = "";
      parent.append(...value);
      return value;
    }

    console.log(`[Warn] Skipped inserting ${value}`);
    return current;
  }
}

export default CornElement;
