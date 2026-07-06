const express = require("express");
const cors = require("cors");

const projectsRoutes = require("./routes/projects.routes");
const modulesRoutes = require("./routes/modules.routes");
const connectionsRoutes = require("./routes/connections.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/projects", projectsRoutes);
app.use("/api/projects/:projectId/modules", modulesRoutes.projectScopedRouter);
app.use("/api/modules", modulesRoutes.flatRouter);
app.use("/api/projects/:projectId/connections", connectionsRoutes.projectScopedRouter);
app.use("/api", connectionsRoutes.flatRouter);

app.use((err, req, res, next) => {
  // Errores conocidos de Prisma originados por datos de entrada inválidos
  // (enum inexistente, referencia a un id que no existe): son errores del
  // cliente, no del servidor, así que deben responder 400/404 en vez de 500.
  if (err.code === "P2025") {
    return res.status(404).json({ error: "El recurso solicitado no existe." });
  }
  if (err.code === "P2003") {
    return res.status(400).json({ error: "Referencia inválida: el recurso relacionado no existe." });
  }
  if (err.name === "PrismaClientValidationError") {
    return res.status(400).json({ error: "Datos inválidos en la solicitud." });
  }

  console.error(err);
  res.status(500).json({ error: "Error interno del servidor." });
});

module.exports = app;
