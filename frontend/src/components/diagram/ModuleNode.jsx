import { Handle, Position } from "reactflow";

export default function ModuleNode({ data }) {
  const isControl = data.type === "CONTROL";
  const flagged = data.hasUndesirableCoupling;

  return (
    <div
      onClick={() => data.onSelect?.(data.moduleId)}
      title={flagged ? "Tiene al menos una conexión con acoplamiento no deseable" : undefined}
      style={{
        position: "relative",
        padding: "10px 14px",
        borderRadius: 8,
        minWidth: 160,
        textAlign: "center",
        cursor: "pointer",
        background: isControl ? "#e7f0fd" : "#e6f7ec",
        border: `2px solid ${flagged ? "#e03131" : isControl ? "#1971c2" : "#2f9e44"}`,
        boxShadow: flagged ? "0 0 0 3px rgba(224, 49, 49, 0.2)" : undefined,
      }}
    >
      {flagged && (
        <span
          title="Acoplamiento no deseable"
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            fontSize: 14,
            background: "#e03131",
            color: "#fff",
            borderRadius: "50%",
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ⚠
        </span>
      )}
      <Handle type="target" position={Position.Top} />
      <div style={{ fontWeight: 600, fontSize: 13 }}>{data.name}</div>
      <div style={{ fontSize: 11, color: "#555" }}>{isControl ? "Control" : "Subordinado"}</div>
      <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>Fan-out: {data.fanOut ?? 0}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
