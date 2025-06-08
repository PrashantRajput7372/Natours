//this page is responsible for all the routes here you can create new routes also for tours

const express = require("express");
const tourController = require("../Controler/tourController");
const router = express.Router();
const authController = require("../Controler/authController");

// const checkID = (req, res, next, val) => {
//   // Your middleware logic here

//   if (val) console.log(`id is----->${val}`);
//   next();
// };

router.route("/").get(tourController.getAllTour).post(tourController.addTour);

router.route("/stas").get(tourController.getTourStats);
// router.param("id", tourController.checkId); 🐒🐒🐒this we were using for check id now it commentd

//this we have created for top 5 cheap and best tours using middle ware  for users quick access...
router
  .route("/top-5-tours")
  .get(tourController.topTours, tourController.getAllTour);
router.route("/monthly-plans/:year").get(tourController.getMonthlyPlan);
router
  .route("/:id")
  .get(authController.protect, tourController.tourById)
  .delete(
    authController.protect,
    authController.restrictTO("admin", "lead-guide"),
    tourController.deleteTour
  )
  .patch(tourController.editTour);

//********Either you can make {get,edit,delete,update} using below thing else you can use route in which you can do option chaining to make code look clean */
// app.get(`/api/v1/tours/:id`, tourById);
// app.patch("/api/v1/tours/:id", editTour);
// app.delete("/api/v1/tours/:id", deleteTour);

//this is litsening to to the port which contains a call back which help in knowing that our page is running

module.exports = router;
