const prisma = require("../lib/prisma");

async function listModules(req, res) {
  const modules = await prisma.module.findMany({
    where: { projectId: Number(req.params.projectId) },
  });
  res.json(modules);
}

async function createModule(req, res) {
  const { name, type, description, posX, posY } = req.body;
  if (!name || !type) return res.status(400).json({ error: "Nombre y tipo son obligatorios." });

  const module_ = await prisma.module.create({
    data: {
      projectId: Number(req.params.projectId),
      name,
      type,
      description,
      posX: posX ?? 0,
      posY: posY ?? 0,
    },
  });
  res.status(201).json(module_);
}

async function updateModule(req, res) {
  const { name, type, description } = req.body;
  const module_ = await prisma.module.update({
    where: { id: Number(req.params.id) },
    data: { name, type, description },
  });
  res.json(module_);
}

async function updateModulePosition(req, res) {
  const { posX, posY } = req.body;
  const module_ = await prisma.module.update({
    where: { id: Number(req.params.id) },
    data: { posX, posY },
  });
  res.json(module_);
}

async function deleteModule(req, res) {
  await prisma.module.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
}

module.exports = { listModules, createModule, updateModule, updateModulePosition, deleteModule };
