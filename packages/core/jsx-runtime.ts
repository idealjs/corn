import hyper from "./src/lib/hyper";

export namespace JSX {
  export interface IntrinsicElements {
    // HTML
    div: unknown;
    button: unknown;
  }
}

export const jsx = hyper;

export const jsxs = hyper;
