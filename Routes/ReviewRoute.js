const express = require("express");
const review = require("../Controler/reviewController");
const auth = require("../Controler/authController");
const router = express.Router();

router
  .route("/")
  .get(auth.protect, review.getAllReview)
  .post(auth.protect, auth.restrictTO("user"), review.setReview);

module.exports = router;
