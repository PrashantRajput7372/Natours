const express = require("express");
const review = require("../Controler/reviewController");
const auth = require("../Controler/authController");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(auth.protect, review.getAllReview)
  .post(auth.protect, auth.restrictTO("user"), review.setReview);

router.route("/:id").delete(auth.protect,auth.restrictTO("user"), review.deleteReview).patch(auth.protect,auth.restrictTO("user"), review.updateReview);


module.exports = router;
