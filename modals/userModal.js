const { lowerCase } = require("lodash");
const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your name"],
    minlength: 2,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter a valid Email"],
    unique: true,
    lowerCase: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin", "guide", "lead-guide"],
    default: "user",
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      //this only works on .create and .savep
      validator: function (el) {
        return el === this.password;
      },
      message: "Password didnot matched!!! Retry",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  phoneNumber: {
    type: Number,
    required: true,
    min: 10,
  },
  photo: {
    type: String,
  },
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// to check wether the provided password is correct or not
userSchema.methods.correctPassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

//to check weather password was reset after token was provided..
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

//password rest token
userSchema.methods.createPassWordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// before saving password check if the pass is modified if modified hash and store it and make confirm password undefined
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  // this.passwordChangedAt = Date.now() - 1000;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
