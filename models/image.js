const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const img = mongoose.Schema({
  path: {
    type: String,
    required: true,
    trim: true,
  },
  originalname: {
    type: String,
    required: true,
  },
});

// Virtual for genre's URL
Image.virtual("url").get(function () {
  return "/items/" + this._id;
});

module.exports = mongoose.model("Item", ItemSchema);
