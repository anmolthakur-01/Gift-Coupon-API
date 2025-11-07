const express = require("express");
const router = express.Router();
const {
  createCoupon,
  getAllCoupon,
  getOneCoupon,
  updateCoupon,
  deleteCoupon,
  oneTimeCoupon
} = require("../controllers/couponController");

router.post("/create", createCoupon);
router.get("/get-all", getAllCoupon);
router.get("/get-one/:id", getOneCoupon);
router.put("/update", updateCoupon);
router.delete("/delete/:id", deleteCoupon);
router.post("/use", oneTimeCoupon);

module.exports = router;
