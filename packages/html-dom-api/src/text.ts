//setTextContent
export const setTextContent = (node: Node, text: string | null) => {
  node.textContent = text;
};

//getTextContent
export const getTextContent = (node: Node) => {
  return node.textContent;
};
