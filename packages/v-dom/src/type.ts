export interface IDomApi {
  createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options?: ElementCreationOptions
  ): HTMLElementTagNameMap[K];
  createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
  createElementNS(
    namespaceURI: "http://www.w3.org/1999/xhtml",
    qualifiedName: string
  ): HTMLElement;
  createElementNS<K extends keyof SVGElementTagNameMap>(
    namespaceURI: "http://www.w3.org/2000/svg",
    qualifiedName: K
  ): SVGElementTagNameMap[K];
  createElementNS(
    namespaceURI: "http://www.w3.org/2000/svg",
    qualifiedName: string
  ): SVGElement;
  createElementNS(
    namespaceURI: string | null,
    qualifiedName: string,
    options?: ElementCreationOptions
  ): Element;
  createElementNS(
    namespace: string | null,
    qualifiedName: string,
    options?: string | ElementCreationOptions
  ): Element;
  createTextNode(data: string): Text;
  createDocumentFragment(): DocumentFragment;
  createComment(data: string): Comment;

  isElement: (node: Node) => node is Element;
  isAttribute: (node: Node) => node is Attr;
  isText: (node: Node) => node is Text;
  isCDATASection: (node: Node) => node is CDATASection;
  isComment: (node: Node) => node is Comment;
  isDocument: (node: Node) => node is Document;
  isDocumentType: (node: Node) => node is DocumentType;
  isFragment: (node: Node) => node is DocumentFragment;

  insertBefore: (parent: Node, node: Node, reference: Node) => void;
  removeChild: (parent: Node, node: Node) => void;
  appendChild: (parent: Node, node: Node) => void;
  parentNode: (node: Node) => Node | null;
  nextSibling: (node: Node) => Node | null;

  setTextContent: (node: Node, text: string | null) => void;
  getTextContent: (node: Node) => string | null;
}
