//insertBefore
export const insertBefore = (parent: Node, node: Node, reference: Node) => {
  parent.insertBefore(node, reference);
};

//removeChild
export const removeChild = (parent: Node, node: Node) => {
  parent.removeChild(node);
};

//appendChild
export const appendChild = (parent: Node, node: Node) => {
  parent.appendChild(node);
};

//parentNode
export const parentNode = (node: Node) => {
  return node.parentNode;
};

//nextSibling
export const nextSibling = (node: Node) => {
  return node.nextSibling;
};
