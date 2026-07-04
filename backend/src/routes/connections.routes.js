const express = require("express");
const {
  listConnections,
  createConnection,
  updateConnection,
  deleteConnection,
} = require("../controllers/connections.controller");

// Montado bajo /api/projects/:projectId/connections
const projectScopedRouter = express.Router({ mergeParams: true });
projectScopedRouter.get("/", listConnections);
projectScopedRouter.post("/", createConnection);

// Montado bajo /api/connections
const flatRouter = express.Router();
flatRouter.put("/connections/:id", updateConnection);
flatRouter.delete("/connections/:id", deleteConnection);

module.exports = { projectScopedRouter, flatRouter };
