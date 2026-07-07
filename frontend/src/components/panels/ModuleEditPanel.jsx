import { useEffect, useState } from "react";

const EMPTY = {
  name: "",
  type: "SUBORDINATE",
  description: "",
};

export default function ModuleEditPanel({ module, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(module ? { ...EMPTY, ...module } : EMPTY);
  }, [module]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>{module ? "Editar módulo" : "Nuevo módulo"}</h3>
        <button type="button" onClick={onClose}>✕</button>
      </div>

      {module && (
        <p className="module-metrics">
          Amplitud de control (fan-out): <strong>{module.fanOut ?? 0}</strong>
          {module.hasUndesirableCoupling && (
            <span className="coupling-badge coupling-control"> ⚠ acoplamiento no deseable</span>
          )}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Nombre
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label>
          Tipo
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="CONTROL">Control</option>
            <option value="SUBORDINATE">Subordinado</option>
          </select>
        </label>

        <label>
          Descripción
          <textarea
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>

        <div className="panel-actions">
          <button type="submit">Guardar</button>
          {module && (
            <button type="button" className="danger" onClick={() => onDelete(module.id)}>
              Eliminar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
