import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProjects, createProject, deleteProject } from "../api/projects";

export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    try {
      setProjects(await listProjects());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    if (!window.confirm("¿Eliminar este proyecto? Esta acción no se puede deshacer.")) return;
    try {
      await deleteProject(id);
    } catch (err) {
      // Si el borrado falla, mostramos el error pero igual refrescamos la lista
      // para que quede sincronizada con el backend (nunca queda en blanco).
      setError(err.message);
    }
    reload();
  }

  return (
    <div className="home">
      <header className="home-hero">
        <div className="home-hero-inner">
          <span className="home-badge">StructChart</span>
          <h1>Diseño Estructurado &amp; Cartas de Estructura</h1>
          <p>
            Construye cartas de estructura de forma visual, identifica el tipo de acoplamiento entre
            módulos y evalua la calidad del diseño jerárquico de tu sistema.
          </p>
        </div>
      </header>

      <main className="home-content">
        {error && <p className="error-banner">{error}</p>}

        <section className="card new-project-card">
          <h2>Nuevo proyecto</h2>
          <form onSubmit={handleCreate} className="new-project-form">
            <div className="field">
              <label htmlFor="project-name">Nombre del proyecto</label>
              <input
                id="project-name"
                placeholder="Ej. Sistema de Facturación"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="field field-grow">
              <label htmlFor="project-description">Descripción</label>
              <input
                id="project-description"
                placeholder="Breve descripción del sistema a diseñar"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Crear proyecto
            </button>
          </form>
        </section>

        <section className="projects-section">
          <div className="projects-section-header">
            <h2>Tus proyectos</h2>
            {!loading && <span className="projects-count">{projects.length}</span>}
          </div>

          {loading && <p className="muted">Cargando proyectos…</p>}

          {!loading && projects.length === 0 && (
            <div className="empty-state">
              <p>Todavía no creaste ningún proyecto.</p>
              <span>Usá el formulario de arriba para empezar tu primera carta de estructura.</span>
            </div>
          )}

          {!loading && projects.length > 0 && (
            <div className="projects-grid">
              {projects.map((project) => (
                <article key={project.id} className="project-card">
                  <div className="project-card-body">
                    <h3>{project.name}</h3>
                    <p>{project.description || "Sin descripción"}</p>
                  </div>
                  <div className="project-card-actions">
                    <Link to={`/projects/${project.id}`} className="btn btn-secondary">
                      Abrir
                    </Link>
                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(project.id)}>
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
