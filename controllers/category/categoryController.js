const Category = require("../../models/Category");
const Shayari = require("../../models/Shayari");

/**
 * Get All Categories
 */
exports.getAll = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {
      isActive: true
    };

    if (req.query.search) {
      filter.name = {
        $regex: req.query.search,
        $options: "i"
      };
    }

    const total = await Category.countDocuments(filter);

    const categories = await Category.find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      categories
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};

/**
 * Get Single Category
 */
exports.getOne = async (req, res) => {

  try {

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found."
      });
    }

    return res.json({
      success: true,
      category
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }

};

/**
 * Create Category
 */
exports.create = async (req, res) => {

  try {

    const exists = await Category.findOne({
      name: req.body.name.trim()
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists."
      });
    }

    const category = await Category.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }

};

/**
 * Update Category
 */
exports.update = async (req, res) => {

  try {

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found."
      });
    }

    return res.json({
      success: true,
      message: "Category updated successfully.",
      category
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }

};

/**
 * Delete Category
 */
exports.remove = async (req, res) => {

  try {

    const totalShayari = await Shayari.countDocuments({
      category: req.params.id
    });

    if (totalShayari > 0) {
      return res.status(400).json({
        success: false,
        message: "Category contains Shayari. Delete not allowed."
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found."
      });
    }

    return res.json({
      success: true,
      message: "Category deleted successfully."
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }

};
exports.shayari = async (req, res) => {
    res.status(501).json({
        success: false,
        message: "Not implemented yet."
    });
};

exports.toggle = async (req, res) => {
    res.status(501).json({
        success: false,
        message: "Not implemented yet."
    });
};

exports.featured = async (req, res) => {
    res.status(501).json({
        success: false,
        message: "Not implemented yet."
    });
};

exports.analytics = async (req, res) => {
    res.status(501).json({
        success: false,
        message: "Not implemented yet."
    });
};

exports.seo = async (req, res) => {
    res.status(501).json({
        success: false,
        message: "Not implemented yet."
    });
};
