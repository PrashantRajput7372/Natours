const Review = require("../modals/reviewModal");
const catchAsync = require("./../utils/catchAysnc");

exports.setReview = catchAsync(async (req, res, next) => {
  const reviewdata = await Review.create(req.body);

  res.status(200).json({
    message: "Success",
    data: reviewdata,
  });
});

exports.getAllReview = catchAsync(async (req, res, next) => {
  const review = await Review.find();

  res.status(200).json({
    status: "Success",
    result: review.length,
    data: {
      review,
    },
  });
});
