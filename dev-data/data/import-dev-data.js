//This is the script to write or delete all data from db using terminal for writing all the data we are using tour-simple.json

const { json } = require("body-parser");
const fs = require("fs");
const mogoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../modals/tourModal");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mogoose
  .connect(DB)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

//Import DATA to DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data Succesfully loaded");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();

    console.log("Data Succesfully loaded");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
  console.log("Data Succesfully Deleted");
}

console.log(process.argv);
