const router = require("express").Router();
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("author", "name branch year college")
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not load notes" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, subject, content, resourceLink } = req.body;
    if (!title?.trim() || !subject?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title, subject, and note content are required" });
    }

    const note = await Note.create({
      author: req.user.id,
      title: title.trim(),
      subject: subject.trim(),
      content: content.trim(),
      resourceLink: (resourceLink || "").trim(),
    });
    await note.populate("author", "name branch year college");
    res.status(201).json({ message: "Note published", note });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not publish note" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found or you cannot delete it" });
    res.json({ message: "Note deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not delete note" });
  }
});

module.exports = router;
