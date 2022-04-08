export function filterNodes(nodes, inputValue, typeFilter, filter) {
  const filteredNode = [];
  for (let node of nodes) {
    if (node.children != null) {
      const filtered = filterNodes(node.children, inputValue, typeFilter, filter);
      if ([...filtered].length > 0) {
        filteredNode.push({ ...node, children: filtered });
      }
    } else if (filter(node.textValue, inputValue, typeFilter, node)) {
      filteredNode.push({ ...node });
    }
  }
  return filteredNode;
}
