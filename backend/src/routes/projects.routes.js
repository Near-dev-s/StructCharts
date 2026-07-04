const express = require("express");
const { listProjects, createProject, getProject, updateProject, deleteProject } = require("../controllers/projects.controller");

const router = express.Router();

router.get("/", listProjects);
router.post("/", createProject);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
