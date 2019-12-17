function checkCircleRef(node, parents) {
  if (!node || typeof node !== "object") {
    return false;
  }

  parents = parents || [];
  if (parents.includes(node)) {
    return true;
  }
  parents.push(node);

  return Object.keys(node).some(key => checkCircleRef(node[key], parents.slice()));
}

module.exports = checkCircleRef;
