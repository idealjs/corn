import CornElement from "./src/lib/CornElement";
import hyper from "./src/lib/hyper";

export namespace JSX {
  export interface IntrinsicElements {
    // HTML
    div: Partial<HTMLDivElement> & { key?: string | number };
    button: unknown;
  }

  export interface Element extends CornElement {}
}

export const jsx = hyper;

export const jsxs = hyper;
