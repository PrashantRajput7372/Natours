const { json } = require("body-parser");
const morgan = require("morgan");
const express = require("express");
const tour = require("./Routes/TourRoute");
const user = require("./Routes/UserRoute");
const mogoose = require("mongoose");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controler/errorControler");
const ratelimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const xss = require("xss-clean");
// const path = require("path");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mogoose
  .connect(DB)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

const app = express();

// Set security HTTP headers
app.use(helmet());

// devlopment me morgan yani time dikhata hai
if (process.env.Node_ENV === "development") {
  app.use(morgan("dev"));
}

//ye limit set krta hai ak ip kitna hit kr skta hai ak hours me
const limiter = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  meassage: "Too Many request from this IP, Please try again after an Hour!",
});

app.use("/api", limiter);

//data read krta hai req.body se or usme linit hai 10kb se jada read nai krege
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Routes
app.use("/api/v1/tours", tour);
app.use("/api/v1/user", user);

//koi unknow url ke liye error throw krega
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.url} on this server`));
});

//Global error handler kuch garbar hua to process Exit kr dega error k sath
app.use(globalErrorHandler);
process.on("unhandledRejection", (err) => {
  console.log("Unhandaled Rejection!!! Shurting Down");
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
