const express = require("express");
const {
  listConnections,
  createConnection,
  updateConnection,
  deleteConnection,
  addDataItem,
  updateDataItem,
  deleteDataItem,
} = require("../controllers/connections.controller");
const asyncHandler = require("../lib/asyncHandler");

// Montado bajo /api/projects/:projectId/connections
const projectScopedRouter = express.Router({ mergeParams: true });
projectScopedRouter.get("/", asyncHandler(listConnections));
projectScopedRouter.post("/", asyncHandler(createConnection));

// Montado bajo /api/connections y /api/data-items
const flatRouter = express.Router();
flatRouter.put("/connections/:id", asyncHandler(updateConnection));
flatRouter.delete("/connections/:id", asyncHandler(deleteConnection));
flatRouter.post("/connections/:id/data-items", asyncHandler(addDataItem));
flatRouter.put("/data-items/:id", asyncHandler(updateDataItem));
flatRouter.delete("/data-items/:id", asyncHandler(deleteDataItem));

module.exports = { projectScopedRouter, flatRouter };
