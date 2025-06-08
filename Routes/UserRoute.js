const express = require("express");
const router = express.Router();
const authController = require("./../Controler/authController");
const userController = require("./../Controler/userController");

router.post("/signup", authController.signup);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.get("/userByID/:id", authController.protect, userController.userById);
router.get("/userByID/:id", userController.userById);
router.patch("/deleteMe", authController.protect, userController.deleteMe);
router.post("/updateMe", authController.protect, userController.updateMe);
router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);
router.get("/", authController.protect, userController.getAllUser);
router.post("/login", authController.login);

module.exports = router;
