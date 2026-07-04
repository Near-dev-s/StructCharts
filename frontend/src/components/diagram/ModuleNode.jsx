import { Handle, Position } from "reactflow";

export default function ModuleNode({ data }) {
  const isControl = data.type === "CONTROL";

  return (
    <div
      onClick={() => data.onSelect?.(data.moduleId)}
      style={{
        padding: "10px 14px",
        borderRadius: 8,
        minWidth: 160,
        textAlign: "center",
        cursor: "pointer",
        background: isControl ? "#e7f0fd" : "#e6f7ec",
        border: `2px solid ${isControl ? "#1971c2" : "#2f9e44"}`,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ fontWeight: 600, fontSize: 13 }}>{data.name}</div>
      <div style={{ fontSize: 11, color: "#555" }}>{isControl ? "Control" : "Subordinado"}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
