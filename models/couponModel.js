const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isUsed: {
      type: Boolean,
      default: false, // only used for oneTime coupon
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
