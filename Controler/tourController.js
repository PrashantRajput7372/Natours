// 💲two ways we have done in this project one is from DB and other using json files from dev-data💲
//☺️ 1st one is uncommented is DB and other one is using Json FIles from Dev-data happy learning.....☺️

const { json } = require("express");
const APIFeatures = require("./../utils/APIFeatures");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAysnc");
const Tour = require("./../modals/tourModal");
//APIFeature gives us the filter,sort,limitfields and pagination which is used in getAll tours

//Tour is coming from tour modal which is giving schema and valdiation for tour creation

//middle ware for getting acess to top 5 cheap tours
exports.topTours = (req, res, next) => {
  req.query.sort = "-ratingsAverage,price";
  req.query.limit = 5;
  // req.query.fields = "name,duration,difficulty,ratingsAverage,price,summary";

  next();
};

// for getting all tours in db
//catchAsync is function which catch the err so we dont have to write try catch again and again
exports.getAllTour = catchAsync(async (req, res, next) => {
  const feature = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const tours = await feature.query;
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

//for seraching tour by id from DB
exports.tourById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const reqsTour = await Tour.findById(id);
  if (!reqsTour) {
    return next(new AppError(`No tour found for id :${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    message: "Here is Your Tour",
    data: {
      reqsTour,
    },
  });
});

//for adding tours in DB
exports.addTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "Success",
    data: {
      tour: newTour,
    },
  });
});

// for deleting tours from DB
exports.deleteTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deletedTour = await Tour.findByIdAndDelete(id);

  if (!deletedTour) {
    return next(new AppError(`No tour found for id :${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    result: `Deleted: ${deletedTour.name}`,
    message: `Tour Number:${id} deleted 😒😒😒`,
  });
});

// for editing tour
exports.editTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { name, duration, difficulty, ratingsAverage, price } = req.body;
  const tour = await Tour.findById(id);
  if (!tour) {
    return next(new AppError(`No tour found for id :${id}`, 404));
  }
  if (name) tour.name = name;
  if (duration) tour.duration = duration;
  if (difficulty) tour.difficulty = difficulty;
  if (ratingsAverage) tour.ratingsAverage = ratingsAverage;
  if (price) tour.price = price;
  await tour.save();

  res.status(202).json({
    status: "success",
    message: `Tour Number:${id} edit 😒😒😒`,
    data: {
      tour,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // difficulty: "easy",
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        avgRatings: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        totalPrice: { $sum: "$price" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: `$_id` },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

//////////////////Here Dynamic ends and when we were using without DB then we were using below things

// ✅✅✅ Below is the way how we were doing when we were using json files of dev-data✅✅✅

// const fs = require("fs");

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// //for checking tours id is present or not
// exports.checkId = (req, res, next, val) => {
//   console.log(`Hello From Middle ware 🐒🐒🐒🐒🐒🐒`);
//   const id = val * 1;
//   const tour = tours.find((e) => e.id === id);
//   // console.log(tour);
//   if (!tour) {
//     console.log(`Id not found 😒😒😒😒`);
//     return res.status(404).json({
//       status: "Failed",
//       message: "Invalid ID",
//     });
//   }
//   req.tour = tour;
//   next();
// };
// exports.getAllTour = (req, res) => {
//   res.status(200).json({
//     status: "Success",
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// };

// //for seraching tour by id
// exports.tourById = (req, res) => {
//   const tour = req.tour;
//   console.log(tour);
//   res.status(200).json({
//     status: "success",
//     data: {
//       tour,
//     },
//   });
// };
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price || !req.body.duration) {
//     console.log(
//       `Welcome from check body middleware and you have done some mistake 💣💣💣`
//     );
//     return res.status(400).json({
//       status: "404, Bad Request",
//       message: "Name, Price and Duration are must😒😒😒😒😒",
//     });
//   }
//   next();
// };
// //for adding a tour
// exports.addTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   console.log(req.body.name);
//   const newTour = Object.assign({ id: newId }, req.body);
//   tours.push(newTour);

//   fs.writeFile(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: "Success",
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

// //for deleting
// exports.deleteTour = (req, res) => {
//   const id = req.tour.id;
//   const tour = tours.filter((el) => el.id !== id);
//   fs.writeFile(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(tour),
//     (err) => {
//       console.log("file written");
//       res.status(200).json({
//         status: "success",
//         result: `Preiviously length was ${tours.length}, now lenght is ${
//           tours.length - 1
//         }`,
//         message: `Tour Number:${id} deleted 😒😒😒`,
//       });
//     }
//   );
//   console.log(tours.length);
// };

// // for editing tour
// exports.editTour = (req, res) => {
//   const id = req.tour.id;
//   const tourIndex = tours.findIndex((el) => el.id === id);
//   if (tourIndex === -1) {
//     console.log("Not found");
//     return res.status(404).json({
//       status: "Failed",
//       message: "Erorr 404, ID Not Found",
//     });
//   }
//   const { name, duration, difficulty, ratingsAverage, price } = req.body;
//   if (name) tours[tourIndex].name = name;
//   if (duration) tours[tourIndex].duration = duration;
//   if (difficulty) tours[tourIndex].difficulty = difficulty;
//   if (ratingsAverage) tours[tourIndex].ratingsAverage = ratingsAverage;
//   if (price) tours[tourIndex].price = price;
//   fs.writeFile(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(202).json({
//         status: "success",
//         message: `Tour Number:${id} edit 😒😒😒`,
//         data: {
//           tours: tours[tourIndex],
//         },
//       });
//     }
//   );
// };
