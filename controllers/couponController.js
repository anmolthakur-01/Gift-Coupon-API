const Coupon = require("../models/couponModel");

// CREATE
const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiryDate } = req.body;
    const coupon = await Coupon.create({ code, discount, expiryDate });
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL
const getAllCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
const getOneCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (err) {
    console.log(err.message)
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
const updateCoupon = async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      
      req.body.id,
      {
        new: true,
      }
    );
    if (!updatedCoupon)
      return res.status(404).json({ message: "Coupon not found" });
    res.status(200).json(updatedCoupon);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE
const deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// one-time use
const oneTimeCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    if (coupon.expiryDate < new Date())
      return res.status(400).json({ message: "Coupon expired" });

    if (coupon.isUsed)
      return res.status(400).json({ message: "Coupon already used" });

    coupon.isUsed = true;
    coupon.isActive = false;
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
  oneTimeCoupon,
};
