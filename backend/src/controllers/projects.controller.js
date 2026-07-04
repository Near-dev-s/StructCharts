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
  await prisma.project.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
}

module.exports = { listProjects, createProject, getProject, updateProject, deleteProject };
