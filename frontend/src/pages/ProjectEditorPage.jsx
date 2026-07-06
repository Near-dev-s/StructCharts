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

  const diagramRef = useRef(null);
  const autoLayoutAppliedRef = useRef(false);

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
    setEdges(
      connections.map((c) => ({
        id: String(c.id),
        source: String(c.fromModuleId),
        target: String(c.toModuleId),
        label: c.relationType === "INVOCATION" ? "invocación" : "llamada",
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
    </div>
  );
}
