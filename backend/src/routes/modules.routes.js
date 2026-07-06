const express = require("express");
const {
  listModules,
  createModule,
  updateModule,
  updateModulePosition,
  deleteModule,
} = require("../controllers/modules.controller");
const asyncHandler = require("../lib/asyncHandler");

// Montado dos veces en app.js: bajo /api/projects/:projectId/modules y bajo /api/modules
const projectScopedRouter = express.Router({ mergeParams: true });
projectScopedRouter.get("/", asyncHandler(listModules));
projectScopedRouter.post("/", asyncHandler(createModule));

const flatRouter = express.Router();
flatRouter.put("/:id", asyncHandler(updateModule));
flatRouter.patch("/:id/position", asyncHandler(updateModulePosition));
flatRouter.delete("/:id", asyncHandler(deleteModule));

module.exports = { projectScopedRouter, flatRouter };
