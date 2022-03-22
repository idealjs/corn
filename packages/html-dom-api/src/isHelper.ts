/** node is an element. 1*/
export const isElement = (node: Node): node is Element => {
  return node.nodeType === Node.ELEMENT_NODE;
};

/** node is a Attr node. 2*/
export const isAttribute = (node: Node): node is Attr => {
  return node.nodeType === Node.ATTRIBUTE_NODE;
};

/** node is a Text node. 3*/
export const isText = (node: Node): node is Text => {
  return node.nodeType === Node.TEXT_NODE;
};

/** node is a CDATASection node. 4*/
export const isCDATASection = (node: Node): node is CDATASection => {
  return node.nodeType === Node.CDATA_SECTION_NODE;
};

/** node is a Comment node. 8*/
export const isComment = (node: Node): node is Comment => {
  return node.nodeType === Node.COMMENT_NODE;
};

/** node is a document. 9*/
export const isDocument = (node: Node): node is Document => {
  return node.nodeType === Node.DOCUMENT_NODE;
};

/** node is a doctype. 10*/
export const isDocumentType = (node: Node): node is DocumentType => {
  return node.nodeType === Node.DOCUMENT_TYPE_NODE;
};

/** node is a DocumentFragment node. 11*/
export const isFragment = (node: Node): node is DocumentFragment => {
  return node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
};
