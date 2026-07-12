const prisma = require("../lib/prisma");

async function listProjects(req, res) {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  res.json(projects);
}

async function createProject(req, res) {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "El nombre del proyecto es obligatorio." });

  const project = await prisma.project.create({ data: { name, description } });
  res.status(201).json(project);
}

async function getProject(req, res) {
  const project = await prisma.project.findUnique({ where: { id: Number(req.params.id) } });
  if (!project) return res.status(404).json({ error: "Proyecto no encontrado." });
  res.json(project);
}

async function updateProject(req, res) {
  const { name, description } = req.body;
  const project = await prisma.project.update({
    where: { id: Number(req.params.id) },
    data: { name, description },
  });
  res.json(project);
}

async function deleteProject(req, res) {
  const projectId = Number(req.params.id);

  // Borrado explícito en orden de dependencia (datos -> conexiones -> módulos
  // -> proyecto) dentro de una transacción. NO delegamos en el ON DELETE
  // CASCADE de la base de datos: la tabla Connection tiene DOS claves foráneas
  // hacia Module (fromModuleId y toModuleId), así que al borrar un proyecto una
  // misma conexión es alcanzable por dos caminos de cascada. Algunas versiones
  // de MySQL/MariaDB tratan esa cascada recursiva "como RESTRICT" y lanzan un
  // error de clave foránea, lo que rompía el borrado del proyecto (y tiraba la
  // petición). Borrando las conexiones por id, una sola vez, se elimina esa
  // ambigüedad y el borrado funciona en cualquier versión.
  await prisma.$transaction(async (tx) => {
    const modules = await tx.module.findMany({
      where: { projectId },
      select: { id: true },
    });
    const moduleIds = modules.map((m) => m.id);

    if (moduleIds.length > 0) {
      const connections = await tx.connection.findMany({
        where: {
          OR: [{ fromModuleId: { in: moduleIds } }, { toModuleId: { in: moduleIds } }],
        },
        select: { id: true },
      });
      const connectionIds = connections.map((c) => c.id);

      if (connectionIds.length > 0) {
        await tx.dataItem.deleteMany({ where: { connectionId: { in: connectionIds } } });
        await tx.connection.deleteMany({ where: { id: { in: connectionIds } } });
      }
      await tx.module.deleteMany({ where: { id: { in: moduleIds } } });
    }

    await tx.project.delete({ where: { id: projectId } });
  });

  res.status(204).send();
}

module.exports = { listProjects, createProject, getProject, updateProject, deleteProject };
