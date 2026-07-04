const express = require("express");
const {
  listModules,
  createModule,
  updateModule,
  updateModulePosition,
  deleteModule,
} = require("../controllers/modules.controller");

// Montado dos veces en app.js: bajo /api/projects/:projectId/modules y bajo /api/modules
const projectScopedRouter = express.Router({ mergeParams: true });
projectScopedRouter.get("/", listModules);
projectScopedRouter.post("/", createModule);

const flatRouter = express.Router();
flatRouter.put("/:id", updateModule);
flatRouter.patch("/:id/position", updateModulePosition);
flatRouter.delete("/:id", deleteModule);

module.exports = { projectScopedRouter, flatRouter };
