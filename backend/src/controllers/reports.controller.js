const prisma = require("../lib/prisma");
const { buildQualityReport } = require("../lib/qualityReport");

async function getQualityReport(req, res) {
  const projectId = Number(req.params.projectId);

  const [project, modules, connections] = await Promise.all([
    prisma.project.findUnique({ where: { id: projectId } }),
    prisma.module.findMany({ where: { projectId } }),
    prisma.connection.findMany({
      where: { fromModule: { projectId } },
      include: { fromModule: true, toModule: true, dataItems: true },
    }),
  ]);

  if (!project) return res.status(404).json({ error: "Proyecto no encontrado." });

  const report = buildQualityReport(modules, connections);
  res.json({ project: { id: project.id, name: project.name }, generatedAt: new Date().toISOString(), ...report });
}

module.exports = { getQualityReport };
