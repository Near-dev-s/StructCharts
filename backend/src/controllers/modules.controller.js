const prisma = require("../lib/prisma");
const { classifyCoupling, isUndesirableCoupling } = require("../lib/coupling");

const CONNECTIONS_INCLUDE = {
  connectionsFrom: { include: { dataItems: true } },
  connectionsTo: { include: { dataItems: true } },
};

// Adjunta dos métricas derivadas del árbol al módulo:
// - fanOut (requisito 8): cuántos módulos llama directamente (sus conexiones salientes).
// - hasUndesirableCoupling (requisito 7): si alguna conexión que lo toca (entrante
//   o saliente) quedó clasificada como acoplamiento de sello o de control.
function withModuleMetrics(module_) {
  const outgoing = module_.connectionsFrom || [];
  const incoming = module_.connectionsTo || [];
  const hasUndesirableCoupling = [...outgoing, ...incoming].some((c) =>
    isUndesirableCoupling(classifyCoupling(c.dataItems))
  );
  const { connectionsFrom, connectionsTo, ...rest } = module_;
  return { ...rest, fanOut: outgoing.length, hasUndesirableCoupling };
}

async function listModules(req, res) {
  const modules = await prisma.module.findMany({
    where: { projectId: Number(req.params.projectId) },
    include: CONNECTIONS_INCLUDE,
  });
  res.json(modules.map(withModuleMetrics));
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
  // Un módulo recién creado todavía no tiene conexiones.
  res.status(201).json({ ...module_, fanOut: 0, hasUndesirableCoupling: false });
}

async function updateModule(req, res) {
  const { name, type, description } = req.body;
  const module_ = await prisma.module.update({
    where: { id: Number(req.params.id) },
    data: { name, type, description },
    include: CONNECTIONS_INCLUDE,
  });
  res.json(withModuleMetrics(module_));
}

async function updateModulePosition(req, res) {
  const { posX, posY } = req.body;
  const module_ = await prisma.module.update({
    where: { id: Number(req.params.id) },
    data: { posX, posY },
    include: CONNECTIONS_INCLUDE,
  });
  res.json(withModuleMetrics(module_));
}

async function deleteModule(req, res) {
  await prisma.module.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
}

module.exports = { listModules, createModule, updateModule, updateModulePosition, deleteModule };
