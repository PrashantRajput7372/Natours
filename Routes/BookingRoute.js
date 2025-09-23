const express = require("express");
const stripeController = require("../Controler/bookingController");
const auth = require("../Controler/authController");

const router = express.Router();
console.log("stripeRoute loaded");
// router.route("/authProtect").get(auth.protect);
router.get("/checkout-session/:tourId",auth.protect, stripeController.getCheckOutSession);

module.exports = router;