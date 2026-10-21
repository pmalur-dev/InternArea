const Internship = require("../models/Internship");

const mongoose = require("mongoose");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/internships
async function getInternships(req, res, next) {
  try {
    const { location, search } = req.query;

    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    const filter = {};

    if (location) {
      filter.location = {
        $regex: `^${location.trim()}$`,
        $options: "i",
      };
    }

    if (search) {
      const searchRegex = escapeRegex(search.trim());

      filter.$or = [
       { title: { $regex: searchRegex, $options: "i" } },
       { company: { $regex: searchRegex, $options: "i" } },
       { location: { $regex: searchRegex, $options: "i" } },
      ];
    } 

    const total = await Internship.countDocuments(filter);

    const internships = await Internship.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: internships.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: internships,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/internships/:id
async function getInternshipById(req, res, next) {
  try {

   if (!mongoose.isValidObjectId(req.params.id)) {
     return res.status(400).json({
     success: false,
     message: "Invalid internship ID.",
   });
 }

    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/internships
async function createInternship(req, res, next) {
  try {
    const { title, company, location, stipend } = req.body ?? {};

    if (
      typeof title !== "string" || !title.trim() ||
      typeof company !== "string" || !company.trim() ||
      typeof location !== "string" || !location.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, company, and location are required.",
      });
    }

    if (
      typeof stipend !== "number" ||
      !Number.isFinite(stipend) ||
      stipend < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Stipend must be a non-negative number.",
      });
    }

    const internship = await Internship.create({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      stipend,
      employer: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Internship created successfully.",
      data: internship,
    });
  } catch (error) {
    next(error);
  }
}

async function updateInternship(req, res, next) {
  try {

   if (!mongoose.isValidObjectId(req.params.id)) {
     return res.status(400).json({
     success: false,
     message: "Invalid internship ID.",
   });
 }

    const { title, company, location, stipend } = req.body ?? {};
    const updates = {};

    for (const [field, value] of Object.entries({
      title,
      company,
      location,
    })) {
      if (value !== undefined) {
        if (typeof value !== "string" || !value.trim()) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a non-empty string.`,
          });
        }

        updates[field] = value.trim();
      }
    }

    if (stipend !== undefined) {
      if (
        typeof stipend !== "number" ||
        !Number.isFinite(stipend) ||
        stipend < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Stipend must be a non-negative number.",
        });
      }

      updates.stipend = stipend;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update.",
      });
    }

    const internship = await Internship.findOneAndUpdate(
      {
        _id: req.params.id,
        employer: req.user._id,
      },
      updates,
      { new: true, runValidators: true }
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteInternship(req, res, next) {
  try {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
     success: false,
     message: "Invalid internship ID",
    });
  }
    
    const internship = await Internship.findOneAndDelete({
      _id: req.params.id,
      employer: req.user._id,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Internship deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship
};