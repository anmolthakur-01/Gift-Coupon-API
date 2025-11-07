const express = require("express");
const router = express.Router();
const {
  createCoupon,
  getAllCoupon,
  getOneCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon
} = require("../controllers/couponController");

router.post("/create", createCoupon);
router.get("/get-all", getAllCoupon);
router.get("/get-one", getOneCoupon);
router.put("/update", updateCoupon);
router.delete("/delete", deleteCoupon);
router.post("/apply", applyCoupon);

module.exports = router;
