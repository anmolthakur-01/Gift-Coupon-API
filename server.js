const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const couponRoutes = require("./routes/couponRoutes");
const cron = require("node-cron");
const Coupon = require("./models/couponModel");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Gift Coupon API is running!");
});

app.use("/api/coupons", couponRoutes);

// Runs every minute
cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  console.log(`⏰ Running cleanup job at ${now.toLocaleString()}`);

  try {
    // Find expired coupons
    const expiredCoupons = await Coupon.find({ expiryDate: { $lt: now } });

    if (expiredCoupons.length > 0) {
      for (const coupon of expiredCoupons) {
        await Coupon.findByIdAndUpdate(coupon._id, { isActive: false });

        console.log(`🧹 Deleted expired coupon: ${coupon.code}`);
      }
      console.log(`✅ Total deleted: ${expiredCoupons.length}`);
    } else {
      console.log("No expired coupons found.");
    }
  } catch (error) {
    console.error("Error during cleanup:", error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
