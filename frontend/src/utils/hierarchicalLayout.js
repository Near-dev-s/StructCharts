import dagre from "dagre";

const NODE_WIDTH = 180;
// ModuleNode ahora renderiza nombre + tipo + "Fan-out: N" (requisito 8), así
// que necesita más alto que las dos líneas originales para que dagre calcule
// bien el espaciado entre filas del árbol.
const NODE_HEIGHT = 86;

// Calcula posiciones en árbol jerárquico top-down (raíz arriba, subordinados
// por nivel debajo) a partir de los módulos y sus conexiones de llamada.
export function computeHierarchicalPositions(modules, connections) {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: "TB", nodesep: 110, ranksep: 130 });

  for (const module of modules) {
    graph.setNode(String(module.id), { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const conn of connections) {
    graph.setEdge(String(conn.fromModuleId), String(conn.toModuleId));
  }

  dagre.layout(graph);

  const positions = new Map();
  for (const module of modules) {
    const node = graph.node(String(module.id));
    positions.set(module.id, { x: node.x - NODE_WIDTH / 2, y: node.y - NODE_HEIGHT / 2 });
  }
  return positions;
}
