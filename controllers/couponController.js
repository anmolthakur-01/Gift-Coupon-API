const Coupon = require("../models/couponModel");

// CREATE
const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiryDate } = req.body;

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code,
      discount,
      expiryDate,
    });

    res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
const getAllCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(201).json({ message: "Coupon finded successfully", coupons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
const getOneCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.body.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.status(201).json({ message: "Coupon finded successfully", coupon });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
const updateCoupon = async (req, res) => {
  try {
    const { code, discount, expiryDate } = req.body;

    // Require the coupon code to identify which one to update
    if (!code) {
      return res
        .status(400)
        .json({ message: "Coupon code is required to update" });
    }

    // Find and update
    const coupon = await Coupon.findOneAndUpdate(
      { code: code.toUpperCase() },
      { discount, expiryDate },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ message: "Coupon code is required to delete" });
    }

    // Delete coupon by code (case-insensitive)
    const deleted = await Coupon.deleteOne({ code: code.toUpperCase() });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// one-time use
const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon)
      return res.status(404).json({ message: "Invalid coupon code" });

    // Check expiry
    if (coupon.expiryDate < new Date())
      return res.status(400).json({ message: "Coupon expired" });

    // Check if already used
    if (coupon.isUsed)
      return res.status(400).json({ message: "Coupon already used" });

    // Check if active
    if (!coupon.isActive)
      return res.status(400).json({ message: "Coupon is inactive" });

    // Mark coupon as used
    coupon.isUsed = true;
    coupon.isActive = false; // deactivate it
    await coupon.save();

    res.status(200).json({
      message: "Coupon applied successfully",
      discount: coupon.discount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCoupon,
  getAllCoupon,
  getOneCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
