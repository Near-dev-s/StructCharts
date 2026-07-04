import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProjects, createProject, deleteProject } from "../api/projects";

export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState(null);

  async function reload() {
    try {
      setProjects(await listProjects());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await createProject(form);
      setForm({ name: "", description: "" });
      reload();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    await deleteProject(id);
    reload();
  }

  return (
    <div className="page">
      <h1>StructChart — Proyectos de Diseño Estructurado</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleCreate} className="new-project-form">
        <input
          placeholder="Nombre del proyecto"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Crear proyecto</button>
      </form>

      <ul className="project-list">
        {projects.map((project) => (
          <li key={project.id}>
            <Link to={`/projects/${project.id}`}>{project.name}</Link>
            <span className="description">{project.description}</span>
            <button type="button" className="danger" onClick={() => handleDelete(project.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
