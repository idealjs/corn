import { IDomApi } from "./type";

interface VDomApi {
  createElement<K extends keyof HTMLElementTagNameMap>(
    api: IDomApi,
    tagName: K,
    options?: ElementCreationOptions
  ): HTMLElementTagNameMap[K];
  createElement(
    api: IDomApi,
    tagName: string,
    options?: ElementCreationOptions
  ): HTMLElement;

  createElementNS(
    api: IDomApi,
    namespaceURI: "http://www.w3.org/1999/xhtml",
    qualifiedName: string
  ): HTMLElement;
  createElementNS<K extends keyof SVGElementTagNameMap>(
    api: IDomApi,
    namespaceURI: "http://www.w3.org/2000/svg",
    qualifiedName: K
  ): SVGElementTagNameMap[K];
  createElementNS(
    api: IDomApi,
    namespaceURI: "http://www.w3.org/2000/svg",
    qualifiedName: string
  ): SVGElement;
  createElementNS(
    api: IDomApi,
    namespaceURI: string | null,
    qualifiedName: string,
    options?: ElementCreationOptions
  ): Element;
  createElementNS(
    api: IDomApi,
    namespace: string | null,
    qualifiedName: string,
    options?: string | ElementCreationOptions
  ): Element;

  createTextNode(api: IDomApi, data: string): Text;
  createDocumentFragment(api: IDomApi): DocumentFragment;
  createComment(api: IDomApi, data: string): Comment;

  isElement(api: IDomApi, node: Node): node is Element;
  isAttribute(api: IDomApi, node: Node): node is Attr;
  isText(api: IDomApi, node: Node): node is Text;
  isCDATASection(api: IDomApi, node: Node): node is CDATASection;
  isComment(api: IDomApi, node: Node): node is Comment;
  isDocument(api: IDomApi, node: Node): node is Document;
  isDocumentType(api: IDomApi, node: Node): node is DocumentType;
  isFragment(api: IDomApi, node: Node): node is DocumentFragment;

  insertBefore(api: IDomApi, parent: Node, node: Node, reference: Node): void;
  removeChild(api: IDomApi, parent: Node, node: Node): void;
  appendChild(api: IDomApi, parent: Node, node: Node): void;
  parentNode(api: IDomApi, node: Node): Node | null;
  nextSibling(api: IDomApi, node: Node): Node | null;

  setTextContent(api: IDomApi, node: Node, text: string): void;
  getTextContent(api: IDomApi, node: Node): string;
}

// track code will be easier if use class
class VDomApi {
  static createElement<K extends keyof HTMLElementTagNameMap>(
    api: IDomApi,
    tagName: K,
    options: ElementCreationOptions
  ) {
    return api.createElement(tagName, options);
  }
  static createElementNS<K extends keyof SVGElementTagNameMap>(
    api: IDomApi,
    namespaceURI: "http://www.w3.org/2000/svg",
    qualifiedName: K
  ) {
    return api.createElementNS(namespaceURI, qualifiedName);
  }
  static createTextNode(api: IDomApi, data: string) {
    return api.createTextNode(data);
  }
  static createDocumentFragment(api: IDomApi) {
    return api.createDocumentFragment();
  }
  static createComment = (api: IDomApi, data: string) => {
    return api.createComment(data);
  };

  static isElement(api: IDomApi, node: Node) {
    return api.isElement(node);
  }
  static isAttribute(api: IDomApi, node: Node) {
    return api.isAttribute(node);
  }
  static isText(api: IDomApi, node: Node) {
    return api.isText(node);
  }
  static isCDATASection(api: IDomApi, node: Node) {
    return api.isCDATASection(node);
  }
  static isComment(api: IDomApi, node: Node) {
    return api.isComment(node);
  }
  static isDocument(api: IDomApi, node: Node) {
    return api.isDocument(node);
  }
  static isDocumentType(api: IDomApi, node: Node) {
    return api.isDocumentType(node);
  }
  static isFragment(api: IDomApi, node: Node) {
    return api.isFragment(node);
  }

  static insertBefore(api: IDomApi, parent: Node, node: Node, reference: Node) {
    return api.insertBefore(parent, node, reference);
  }
  static removeChild(api: IDomApi, parent: Node, node: Node) {
    return api.removeChild(parent, node);
  }
  static appendChild(api: IDomApi, parent: Node, node: Node) {
    return api.appendChild(parent, node);
  }
  static parentNode(api: IDomApi, node: Node) {
    return api.parentNode(node);
  }
  static nextSibling(api: IDomApi, node: Node) {
    return api.nextSibling(node);
  }

  static setTextContent = (api: IDomApi, node: Node, text: string) => {
    return api.setTextContent(node, text);
  };
  static getTextContent(api: IDomApi, node: Node) {
    return api.getTextContent(node);
  }
}

export default VDomApi;
