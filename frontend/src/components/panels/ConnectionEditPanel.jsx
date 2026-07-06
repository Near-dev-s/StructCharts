import { useEffect, useState } from "react";

const EMPTY_ITEM = { name: "", dataType: "", nature: "ELEMENTARY" };

const NATURE_OPTIONS = [
  { value: "ELEMENTARY", label: "Dato elemental" },
  { value: "STRUCTURE", label: "Estructura/registro" },
  { value: "CONTROL_FLAG", label: "Bandera de control" },
];

export default function ConnectionEditPanel({
  connection,
  onUpdateConnection,
  onDeleteConnection,
  onAddDataItem,
  onUpdateDataItem,
  onDeleteDataItem,
  onClose,
}) {
  const [newItem, setNewItem] = useState(EMPTY_ITEM);

  // Evita que texto sin enviar de la conexión anterior quede en el
  // formulario al seleccionar una conexión distinta.
  useEffect(() => {
    setNewItem(EMPTY_ITEM);
  }, [connection?.id]);

  if (!connection) return null;

  function handleAddDataItem(e) {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    onAddDataItem(connection.id, newItem);
    setNewItem(EMPTY_ITEM);
  }

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

      <h4>Datos intercambiados</h4>
      <table className="data-items-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo de dato</th>
            <th>Naturaleza</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(connection.dataItems || []).map((item) => (
            <tr key={item.id}>
              <td>
                <input
                  value={item.name}
                  onChange={(e) => onUpdateDataItem(item.id, { name: e.target.value })}
                />
              </td>
              <td>
                <input
                  value={item.dataType}
                  onChange={(e) => onUpdateDataItem(item.id, { dataType: e.target.value })}
                />
              </td>
              <td>
                <select
                  value={item.nature}
                  onChange={(e) => onUpdateDataItem(item.id, { nature: e.target.value })}
                >
                  {NATURE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button type="button" className="danger" onClick={() => onDeleteDataItem(item.id)}>
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleAddDataItem} className="add-data-item-form">
        <input
          placeholder="Nombre"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          placeholder="Tipo (ej. int, Cliente[])"
          value={newItem.dataType}
          onChange={(e) => setNewItem({ ...newItem, dataType: e.target.value })}
        />
        <select
          value={newItem.nature}
          onChange={(e) => setNewItem({ ...newItem, nature: e.target.value })}
        >
          {NATURE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button type="submit">Agregar</button>
      </form>

      <div className="panel-actions">
        <button type="button" className="danger" onClick={() => onDeleteConnection(connection.id)}>
          Eliminar conexión
        </button>
      </div>
    </div>
  );
}
