const { json } = require("express");
const APIFeatures = require("./../utils/APIFeatures");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAysnc");
const User = require("./../modals/userModal");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Get all Users

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "Success",
    message: "Get the below user",
    data: {
      users,
    },
  });
});

//Get Specific user By ID
exports.userById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  const reqsUser = await User.findById(id);
  console.log(reqsUser, "user");
  if (!reqsUser) {
    return next(new AppError(`No User found for id :${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      User: reqsUser,
    },
  });
});

//User can delete them self which will not delete them but simply make them inactive so they can login when they want
// an user wont be found as they are marked inactive.
exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+active");
  user.active = false;
  user.password = req.body.password;
  user.confirmPassword = req.body.password;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
  });
});

// Users Can update them self except password and what is allowed in filter
exports.updateMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError("Kindly update password from /updatePassword", 404)
    );
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
