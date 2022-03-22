import { IDomApi } from "@idealjs/v-dom";

import {
  createComment,
  createDocumentFragment,
  createElement,
  createElementNS,
  createTextNode,
} from "./src/create";
import {
  isAttribute,
  isCDATASection,
  isComment,
  isDocument,
  isDocumentType,
  isElement,
  isFragment,
  isText,
} from "./src/isHelper";
import {
  appendChild,
  insertBefore,
  nextSibling,
  parentNode,
  removeChild,
} from "./src/node";
import { getTextContent, setTextContent } from "./src/text";

const api: IDomApi = {
  createElement: createElement,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createDocumentFragment: createDocumentFragment,
  createComment: createComment,

  isElement: isElement,
  isAttribute: isAttribute,
  isText: isText,
  isCDATASection: isCDATASection,
  isComment: isComment,
  isDocument: isDocument,
  isDocumentType: isDocumentType,
  isFragment: isFragment,

  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,

  setTextContent: setTextContent,
  getTextContent: getTextContent,
};

export default api;
