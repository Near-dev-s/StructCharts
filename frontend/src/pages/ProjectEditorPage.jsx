import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNodesState, useEdgesState } from "reactflow";
import DiagramCanvas from "../components/diagram/DiagramCanvas";
import Toolbar from "../components/shared/Toolbar";
import ModuleEditPanel from "../components/panels/ModuleEditPanel";
import ConnectionEditPanel from "../components/panels/ConnectionEditPanel";
import { useProjectData } from "../hooks/useProjectData";
import { getProject } from "../api/projects";
import { createModule, updateModule, updateModulePosition, deleteModule, listModules } from "../api/modules";
import {
  createConnection,
  updateConnection,
  deleteConnection,
  listConnections,
  addDataItem,
  updateDataItem,
  deleteDataItem,
} from "../api/connections";
import { computeHierarchicalPositions } from "../utils/hierarchicalLayout";

export default function ProjectEditorPage() {
  const { projectId } = useParams();
  const id = Number(projectId);
  const { modules, connections, loading, error, reload } = useProjectData(id);

  const [project, setProject] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [creatingModule, setCreatingModule] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [panelWidth, setPanelWidth] = useState(340);

  const diagramRef = useRef(null);
  const autoLayoutAppliedRef = useRef(false);
  const resizingPanelRef = useRef(false);

  // Arrastre del borde izquierdo del panel para agrandarlo/achicarlo; se
  // registra una sola vez y se activa/desactiva con la bandera del ref para
  // no crear/destruir listeners en cada mousedown.
  useEffect(() => {
    function handleMouseMove(e) {
      if (!resizingPanelRef.current) return;
      const newWidth = window.innerWidth - e.clientX;
      setPanelWidth(Math.min(Math.max(newWidth, 300), 800));
    }
    function handleMouseUp() {
      resizingPanelRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function handlePanelResizeStart(e) {
    e.preventDefault();
    resizingPanelRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  useEffect(() => {
    getProject(id).then(setProject);
  }, [id]);

  // Si ningún módulo tiene una posición guardada todavía (todos en 0,0 por
  // defecto), organiza el árbol jerárquico automáticamente al cargar.
  useEffect(() => {
    if (autoLayoutAppliedRef.current || modules.length === 0) return;
    const allUnpositioned = modules.every((m) => m.posX === 0 && m.posY === 0);
    if (allUnpositioned) {
      autoLayoutAppliedRef.current = true;
      handleAutoLayout();
    } else {
      autoLayoutAppliedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modules]);

  useEffect(() => {
    setNodes(
      modules.map((m) => ({
        id: String(m.id),
        type: "module",
        position: { x: m.posX, y: m.posY },
        data: {
          moduleId: m.id,
          name: m.name,
          type: m.type,
          fanOut: m.fanOut,
          hasUndesirableCoupling: m.hasUndesirableCoupling,
          onSelect: (moduleId) => {
            setSelectedModuleId(moduleId);
            setSelectedConnectionId(null);
            setCreatingModule(false);
          },
        },
      }))
    );
  }, [modules, setNodes]);

  useEffect(() => {
    // Etiqueta corta en el diagrama (el detalle completo — tipo de relación,
    // datos intercambiados — se ve en el panel al hacer clic en la conexión);
    // así el texto no se superpone cuando varias conexiones convergen en un
    // mismo nodo.
    setEdges(
      connections.map((c) => ({
        id: String(c.id),
        source: String(c.fromModuleId),
        target: String(c.toModuleId),
        label: c.couplingShortLabel || undefined,
        style: c.isUndesirableCoupling ? { stroke: "#e03131" } : undefined,
        labelStyle: c.isUndesirableCoupling ? { fill: "#e03131", fontWeight: 600 } : undefined,
      }))
    );
  }, [connections, setEdges]);

  async function handleNodeDragStop(_, node) {
    await updateModulePosition(Number(node.id), node.position.x, node.position.y);
  }

  async function handleConnect(params) {
    await createConnection(id, { fromModuleId: Number(params.source), toModuleId: Number(params.target) });
    reload();
  }

  function handleNodeClick(_, node) {
    setSelectedModuleId(Number(node.id));
    setSelectedConnectionId(null);
    setCreatingModule(false);
  }

  function handleEdgeClick(_, edge) {
    setSelectedConnectionId(Number(edge.id));
    setSelectedModuleId(null);
    setCreatingModule(false);
  }

  async function handleSaveModule(data) {
    setSelectedModuleId(null);
    setCreatingModule(false);

    if (selectedModuleId) {
      await updateModule(selectedModuleId, data);
      reload();
      return;
    }

    await createModule(id, data);
    // Reacomoda el árbol para que el módulo nuevo no quede superpuesto en (0,0).
    const [freshModules, freshConnections] = await Promise.all([listModules(id), listConnections(id)]);
    const positions = computeHierarchicalPositions(freshModules, freshConnections);
    await Promise.all(
      freshModules.map((m) => {
        const pos = positions.get(m.id);
        return pos ? updateModulePosition(m.id, pos.x, pos.y) : null;
      })
    );
    reload();
  }

  async function handleDeleteModule(moduleId) {
    await deleteModule(moduleId);
    setSelectedModuleId(null);
    reload();
  }

  async function handleAutoLayout() {
    const positions = computeHierarchicalPositions(modules, connections);
    await Promise.all(
      modules.map((m) => {
        const pos = positions.get(m.id);
        return pos ? updateModulePosition(m.id, pos.x, pos.y) : null;
      })
    );
    reload();
  }

  const selectedModule = modules.find((m) => m.id === selectedModuleId) || null;
  const selectedConnection = connections.find((c) => c.id === selectedConnectionId) || null;

  if (loading) return <p className="page">Cargando...</p>;

  return (
    <div className="editor-page">
      <header className="editor-header">
        <Link to="/">← Proyectos</Link>
        <h2>{project?.name}</h2>
      </header>

      {error && <p className="error">{error}</p>}

      <Toolbar
        onAddModule={() => {
          setCreatingModule(true);
          setSelectedModuleId(null);
          setSelectedConnectionId(null);
        }}
        onAutoLayout={handleAutoLayout}
      />

      <div className="editor-body">
        <DiagramCanvas
          ref={diagramRef}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={handleNodeDragStop}
          onConnect={handleConnect}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
        />

        {(selectedModule || creatingModule || selectedConnection) && (
          <div className="panel-container" style={{ width: panelWidth }}>
            <div className="panel-resize-handle" onMouseDown={handlePanelResizeStart} />

            {(selectedModule || creatingModule) && (
              <ModuleEditPanel
                module={selectedModule}
                onSave={handleSaveModule}
                onDelete={handleDeleteModule}
                onClose={() => {
                  setSelectedModuleId(null);
                  setCreatingModule(false);
                }}
              />
            )}

            {selectedConnection && (
              <ConnectionEditPanel
                connection={selectedConnection}
                onUpdateConnection={async (connId, data) => {
                  await updateConnection(connId, data);
                  reload();
                }}
                onDeleteConnection={async (connId) => {
                  await deleteConnection(connId);
                  setSelectedConnectionId(null);
                  reload();
                }}
                onAddDataItem={async (connId, data) => {
                  await addDataItem(connId, data);
                  reload();
                }}
                onUpdateDataItem={async (itemId, data) => {
                  await updateDataItem(itemId, data);
                  reload();
                }}
                onDeleteDataItem={async (itemId) => {
                  await deleteDataItem(itemId);
                  reload();
                }}
                onClose={() => setSelectedConnectionId(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
