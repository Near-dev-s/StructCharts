import { getNodesBounds, getViewportForBounds } from "reactflow";
import { toPng } from "html-to-image";

const IMAGE_WIDTH = 1600;
const IMAGE_HEIGHT = 1200;
const IMAGE_PADDING = 0.15;

// Exporta solo el contenido del árbol (nodos + conexiones), no los controles
// de zoom ni el minimapa, encuadrando todos los módulos con un margen fijo.
export async function exportDiagramAsImage(containerEl, nodes, fileName) {
  const viewportEl = containerEl?.querySelector(".react-flow__viewport");
  if (!viewportEl || nodes.length === 0) {
    throw new Error("No hay nada que exportar todavía: agregá módulos primero.");
  }

  const bounds = getNodesBounds(nodes);
  const { x, y, zoom } = getViewportForBounds(bounds, IMAGE_WIDTH, IMAGE_HEIGHT, 0.2, 2, IMAGE_PADDING);

  const dataUrl = await toPng(viewportEl, {
    backgroundColor: "#fafafa",
    // width/height ya quedan aplicados (con "px") por html-to-image a partir
    // de estas mismas opciones; acá solo hace falta el transform para encuadrar.
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    style: {
      transform: `translate(${x}px, ${y}px) scale(${zoom})`,
    },
  });

  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}
