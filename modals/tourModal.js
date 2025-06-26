const { toLower } = require("lodash");
const mongoose = require("mongoose");
const slugify = require("slugify");
// const Review = require("./reviewModal");

const tourSchema = new mongoose.Schema(
  {
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
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: 1 });
tourSchema.index({ slug: 1 });
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v",
  }).populate({
    path: "reviews",
    select: "-_id",
  });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
