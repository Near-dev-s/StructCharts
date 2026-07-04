const prisma = require("../lib/prisma");

async function listConnections(req, res) {
  const connections = await prisma.connection.findMany({
    where: { fromModule: { projectId: Number(req.params.projectId) } },
    include: { fromModule: true, toModule: true },
  });
  res.json(connections);
}

async function createConnection(req, res) {
  const { fromModuleId, toModuleId, relationType } = req.body;
  if (!fromModuleId || !toModuleId) {
    return res.status(400).json({ error: "fromModuleId y toModuleId son obligatorios." });
  }

  const connection = await prisma.connection.create({
    data: {
      fromModuleId: Number(fromModuleId),
      toModuleId: Number(toModuleId),
      relationType: relationType || "CALL",
    },
    include: { fromModule: true, toModule: true },
  });
  res.status(201).json(connection);
}

async function updateConnection(req, res) {
  const { relationType } = req.body;
  const connection = await prisma.connection.update({
    where: { id: Number(req.params.id) },
    data: { relationType },
    include: { fromModule: true, toModule: true },
  });
  res.json(connection);
}

async function deleteConnection(req, res) {
  await prisma.connection.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
}

module.exports = { listConnections, createConnection, updateConnection, deleteConnection };
