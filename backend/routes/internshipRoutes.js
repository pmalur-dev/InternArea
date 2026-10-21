
const express = require("express");

const router = express.Router();

const requireAuth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship
} = require("../controllers/internshipController");

router.get("/", getInternships);
router.get("/:id", getInternshipById);

router.post("/", requireAuth, requireRole("employer"), createInternship );

router.patch("/:id", requireAuth, requireRole("employer"), updateInternship);
router.delete("/:id", requireAuth, requireRole("employer"), deleteInternship);


module.exports = router;