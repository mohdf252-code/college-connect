const router = require("express").Router();
const Project = require("../models/Project");
const auth = require("../middleware/authMiddleware");

// GET all hackathon/project partner listings
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("author", "name branch year college email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not load hackathon projects" });
  }
});

// POST a new hackathon/project partner request
router.post("/", auth, async (req, res) => {
  try {
    const { title, hackathonName, description, skillsRequired } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: "Project title and description are required" });
    }

    const parsedSkills = Array.isArray(skillsRequired)
      ? skillsRequired
      : (skillsRequired || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    const project = await Project.create({
      author: req.user.id,
      title: title.trim(),
      hackathonName: (hackathonName || "").trim(),
      description: description.trim(),
      skillsRequired: parsedSkills,
    });

    await project.populate("author", "name branch year college email");

    res.status(201).json({
      message: "Hackathon project posted successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not post project" });
  }
});

// DELETE a project listing
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not delete project" });
  }
});

module.exports = router;
