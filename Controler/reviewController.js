const Review = require("../modals/reviewModal");
const catchAsync = require("./../utils/catchAysnc");
const { deleteOne,updateOne } = require("./factorycontroler");

exports.setReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  const reviewdata = await Review.create(req.body);

  res.status(200).json({
    message: "Success",
    data: reviewdata,
  });
});

exports.getAllReview = catchAsync(async (req, res, next) => {
  const filter = req.params.tourId ? { tour: req.params.tourId } : {};
  

  // const
  const review = await Review.find(filter);

  res.status(200).json({
    status: "Success",
    result: review.length,
    data: {
      review,
    },
  });
});

exports.deleteReview = deleteOne(Review);
exports.updateReview = updateOne(Review);
