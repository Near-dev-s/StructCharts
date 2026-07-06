const express = require("express");
const { listProjects, createProject, getProject, updateProject, deleteProject } = require("../controllers/projects.controller");
const asyncHandler = require("../lib/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(listProjects));
router.post("/", asyncHandler(createProject));
router.get("/:id", asyncHandler(getProject));
router.put("/:id", asyncHandler(updateProject));
router.delete("/:id", asyncHandler(deleteProject));

module.exports = router;
