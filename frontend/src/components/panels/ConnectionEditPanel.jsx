export default function ConnectionEditPanel({ connection, onUpdateConnection, onDeleteConnection, onClose }) {
  if (!connection) return null;

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>
          Conexión: {connection.fromModule?.name} → {connection.toModule?.name}
        </h3>
        <button type="button" onClick={onClose}>✕</button>
      </div>

      <label>
        Tipo de relación
        <select
          value={connection.relationType}
          onChange={(e) => onUpdateConnection(connection.id, { relationType: e.target.value })}
        >
          <option value="CALL">Llamada</option>
          <option value="INVOCATION">Invocación</option>
        </select>
      </label>

      <div className="panel-actions">
        <button type="button" className="danger" onClick={() => onDeleteConnection(connection.id)}>
          Eliminar conexión
        </button>
      </div>
    </div>
  );
}
