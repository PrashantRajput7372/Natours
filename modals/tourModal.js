const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour Must have a Name"],
    minlength: 2,
    unique: true,
    trim: true,
  },
  duration: Number,
  price: {
    type: Number,
    required: [true, "A tour Must have a Price"],
    min: 10,
  },
  maxGroupSize: {
    type: Number,
  },
  priceDiscount: Number,
  ratingsAverage: {
    type: Number,
    default: 4,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  difficulty: {
    type: String,
    required: [true, "Difficulty level must be set as: Easy, Medium or Hard"],
    minlength: 4,
  },
  // isOperational: {
  //   type: Boolean,
  //   default: true,
  // },
  summary: {
    type: String,
    trim: true,
    required: [true, "should contain a short description about the Tour"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover Image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
