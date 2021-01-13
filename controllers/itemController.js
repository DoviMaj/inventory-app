const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
var async = require("async");
const category = require("../models/category");

exports.index = async function (req, res, callback) {
  const item_list = await Book.countDocuments({});
  if (err) {
    return next(err);
  }
  //Successful, so render
  res.render("item_list", { title: "Item List", item_list });
};
