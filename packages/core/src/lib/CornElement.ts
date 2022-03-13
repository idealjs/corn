import { ReadFunction } from "@idealjs/corn-reactive";

import { createEffect, createRoot } from "./reactive";

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

  public create(prevEl?: HTMLElement): HTMLElement {
    return createRoot(() => {
      if (this.type instanceof Function) {
        const cornElement = this.type(this.props);
        return createEffect((prevEl) => {
          return cornElement.create(prevEl);
        });
      }
      prevEl = prevEl == null ? document.createElement(this.type) : prevEl;

      //this.props.children may be not array,or CornElement or CornText or Other;
      const children = this.props.children
        ? this.props.children
            .flatMap((child: Primitive | CornElement | ReadFunction) => {
              if (isCornText(child)) {
                return document.createTextNode(child.toString());
              }
              if (child instanceof CornElement) {
                return child.create();
              }
              if (child instanceof Function) {
                const res = child();
                if (isCornText(res)) {
                  return document.createTextNode(res.toString());
                }
                if (res instanceof CornElement) {
                  return res.create();
                }
                if (Array.isArray(res)) {
                  return res.map((r) => r.create());
                }
              }
              console.warn("[warn] skip create", child, typeof child);
              return null;
            })
            .filter(
              (
                c: HTMLElement | Text | undefined | null
              ): c is HTMLElement | Text => c != null
            )
        : null;

      this.upsert(prevEl, children, null);

      if (this.props.onClick && prevEl instanceof Element) {
        Reflect.set(prevEl, "onclick", this.props.onClick);
      }

      return prevEl;
    });
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
