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
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor." });
});

module.exports = app;
