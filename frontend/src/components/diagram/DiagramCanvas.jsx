import { forwardRef } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import ModuleNode from "./ModuleNode";

const nodeTypes = { module: ModuleNode };

const DiagramCanvas = forwardRef(function DiagramCanvas(
  { nodes, edges, onNodesChange, onEdgesChange, onNodeDragStop, onConnect, onNodeClick, onEdgeClick },
  ref
) {
  return (
    <div ref={ref} style={{ width: "100%", height: "100%", background: "#fafafa" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
});

export default DiagramCanvas;
